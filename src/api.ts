import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { compile } from 'path-to-regexp';

export let request: AxiosInstance;

const defaultOptions = {
  baseURL: 'localhost:8080/wp-json',
  headers: { 'Content-Type': 'application/json' }
};

export const setRequestOptions = (options: AxiosRequestConfig): void => {
  request = axios.create({ ...defaultOptions, ...options });
};

function formatPost(post: any): any {
  return {
    ...post,
    ...post.acf,
    dateCreated: post.date,
    dateModified: post.modified,
    path: post.path || '',
    title: post.title.rendered
  };
}

export interface WPFetchOptions extends AxiosRequestConfig {
  urlParams?: Record<string, any>;
}

/**
 * Fetch data from the WordPress API
 * @param {string} path - the path to fetch data from (e.g. `/wp/v2/posts`)
 * @param {WPFetchOptions} options - options to add to the request
 * @return {Promise<object|object[]>} the response from the WordPress API
 * @see https://github.com/axios/axios for more options
 */
export async function wpFetch<T extends any | any[]>(
  path: string,
  { urlParams, ...options }: WPFetchOptions = {}
): Promise<T> {
  const compiledPath = urlParams ? compile(path)(urlParams) : path;

  try {
    const response = await request(compiledPath, options);
    const { data } = response;
    return Array.isArray(data) ? data.map(formatPost) : formatPost(data);
  } catch (error) {
    console.error('Error when fetching path...');
    console.error({ path, message: error.message, urlParams, options });
  }
}
