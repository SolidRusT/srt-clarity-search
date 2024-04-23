import { OpenAIModel } from "@/types";
import { createParser, ParsedEvent, ReconnectInterval } from "eventsource-parser";

export const OpenAIStream = async (prompt: string, apiKey: string) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const res = await fetch(OpenAIModel.INFERENCE_URL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    method: "POST",
    body: JSON.stringify({
      json_schema: {
        "type": "object",
        "properties": {
          "answer": {
            "type": "string",
            "description": "A text string containing the answer."
          },
          "sources": {
            "type": "array",
            "description": "A list of strings, each representing a source citation.",
            "items": {
              "type": "string"
            }
          }
        },
        "required": ["answer", "sources"],
        "additionalProperties": false
      },
      model: OpenAIModel.DAVINCI_TURBO,
      messages: [
        { role: "system", content: "You are a helpful assistant that accurately answers the user's queries based on the given text." },
        { role: "user", content: prompt }
      ],
      max_tokens: 200,
      temperature: 0.0,
      stream: true
    })
  });

  if (res.status !== 200) {
    throw new Error("OpenAI API returned an error");
  }

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          const data = event.data;

          if (data === "[DONE]") {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    }
  });

  return stream;
};
