export interface RequestOptions {
  body?: Record<string, unknown>;
  query?: string;
}

export class APIHelpers {
  static async get(path: string, options: RequestOptions = {}) {
    return this._sendRequest(path, options, "GET");
  }

  static async patch(path: string, options: RequestOptions = {}) {
    return this._sendRequest(path, options, "PATCH");
  }

  static async post(path: string, options: RequestOptions = {}) {
    return this._sendRequest(path, options, "POST");
  }

  static async delete(path: string, options: RequestOptions = {}) {
    return this._sendRequest(path, options, "DELETE");
  }

  private static async _sendRequest(
    url: string,
    options: RequestOptions = {},
    method: string
  ) {
    try {
      if (options.query) {
        const queryString = new URLSearchParams(options.query).toString();
        url = url + "?" + queryString;
      }

      const requestOptions = {
        headers: this._getHeaders(),
        method: method,
        ...options,
      } as RequestInit;

      if (requestOptions.body) {
        requestOptions.body = JSON.stringify(options.body);
      }

      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw response;
      }
      return response.json();
    } catch (error: unknown) {
      const response = await (error as { text: () => Promise<string> }).text();
      let jsonResponse;
      try {
        jsonResponse = JSON.parse(response);
      } catch (e) {
        throw response;
      }
      throw jsonResponse;
    }
  }

  private static _getHeaders() {
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  }
}

export default APIHelpers;
