export enum OpenAIModel {
  DAVINCI_TURBO = "gpt-3.5-turbo",
  INFERENCE_URL = "https://api.openai.com/v1/chat/completions"
  //INFERENCE_URL = "http://localhost:5000/v1/chat/completions"
}

export type Source = {
  url: string;
  text: string;
};

export type SearchQuery = {
  query: string;
  sourceLinks: string[];
};
