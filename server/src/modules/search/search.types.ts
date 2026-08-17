export interface SearchQuery {
  workspaceId: string;
  query: string;
}

export interface SearchOptions {
  limit?: number;
}

export interface SearchResult {
  id: string;
  content: string;
  chunkIndex: number;
  documentId: string;
  fileName: string;

  /**
   * Relevance score produced by the retrieval strategy.
   *
   * For vector retrieval this will represent semantic similarity.
   * For keyword retrieval this will represent lexical relevance.
   */
  score: number;
}

export interface SearchResponse {
  results: SearchResult[];
}
