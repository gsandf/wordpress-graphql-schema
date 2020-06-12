import { get } from '@blakek/deep';
import { wpFetch } from '../api';
import { filterArray } from '../utils';
import * as WP from '../wordpress-graphql-schema';

interface PostInputArguments {
  id?: number | string;
  preview?: boolean;
  slug?: string;
}

export const postFields = /* GraphQL */ `
  dateCreated: DateTime! @formatDate
  dateModified: DateTime! @formatDate
  id: ID!
  path: String!
  slug: String!
  status: PostStatus!
  template: String
  title: String!
  type: String!
`;

export const postFilterFields = /* GraphQL */ `
  dateCreated: FilterableDateTime
  dateModified: FilterableDateTime
  id: FilterableInt
  path: FilterableString
  slug: FilterableString
  status: FilterableString
  template: FilterableString
  title: FilterableString
  type: FilterableString
`;

export const resolvers = {
  Media: {
    altText: (parent: WP.UnformattedMedia): string => parent.alt_text,
    sizes: (parent: WP.UnformattedMedia): WP.UnformattedMediaSizes =>
      parent.media_details.sizes
  },
  MediaSize: {
    url: (parent: WP.UnformattedMediaSize): string => parent.source_url
  },
  Page: {
    content: (parent: WP.UnformattedPost): string => parent.content.rendered,
    excerpt: (parent: WP.UnformattedPost): string => parent.excerpt.rendered,
    featuredMedia: (
      parent: WP.UnformattedPost
    ): Promise<WP.UnformattedMedia> => {
      if (!parent.featured_media) return null;
      return wpFetch<WP.UnformattedMedia>('/wp/v2/media/:id', {
        urlParams: { id: parent.featured_media }
      });
    }
  },
  Post: {
    content: (parent: WP.UnformattedPost): string => parent.content.rendered,
    excerpt: (parent: WP.UnformattedPost): string => parent.excerpt.rendered,
    featuredMedia: (
      parent: WP.UnformattedPost
    ): Promise<WP.UnformattedMedia> => {
      if (!parent.featured_media) return null;
      return wpFetch<WP.UnformattedMedia>('/wp/v2/media/:id', {
        urlParams: { id: parent.featured_media }
      });
    }
  },
  PostStatus: {
    ACF_DISABLED: 'acf-disabled',
    ANY: 'any',
    AUTO_DRAFT: 'auto-draft',
    DRAFT: 'draft',
    FUTURE: 'future',
    INHERIT: 'inherit',
    PENDING: 'pending',
    PRIVATE: 'private',
    PUBLISH: 'publish',
    REQUEST_COMPLETED: 'request-completed',
    REQUEST_CONFIRMED: 'request-confirmed',
    REQUEST_FAILED: 'request-failed',
    REQUEST_PENDING: 'request-pending',
    TRASH: 'trash'
  },
  Query: {
    allPage: (
      _: unknown,
      { filter }: { filter: WP.PostFilterFields }
    ): Promise<WP.PostFields[]> =>
      wpFetch<WP.PostFields[]>('/wp/v2/pages').then(data =>
        filterArray(data, filter)
      ),
    allPost: (
      _: unknown,
      { filter }: { filter: WP.PostFilterFields }
    ): Promise<WP.PostFields[]> =>
      wpFetch<WP.PostFields[]>('/wp/v2/posts').then(data =>
        filterArray(data, filter)
      ),
    page: async (
      _: unknown,
      { id, preview, slug }: PostInputArguments
    ): Promise<any> => {
      if (!id) {
        if (!slug) {
          throw new Error('either `id` or `slug` is required');
        }

        id = await wpFetch('/wp/v2/pages', {
          params: { slug }
        }).then(pages => get(pages, '0.id'));
      }

      const pageData = await wpFetch('/wp/v2/pages/:id', {
        urlParams: { id }
      });

      if (preview) {
        return wpFetch<any[]>(
          get(pageData, '_links.version-history.0.href')
        ).then(results => results[0]);
      }

      return pageData;
    },
    post: async (
      _: unknown,
      { id, preview, slug }: PostInputArguments
    ): Promise<any> => {
      if (!id) {
        if (!slug) {
          throw new Error('either `id` or `slug` is required');
        }

        id = await wpFetch('/wp/v2/posts', {
          params: { slug }
        }).then(posts => get(posts, '0.id'));
      }

      const postData = await wpFetch('/wp/v2/posts/:id', {
        urlParams: { id }
      });

      if (preview) {
        return wpFetch<any[]>(
          get(postData, '_links.version-history.0.href')
        ).then(results => results[0]);
      }

      return postData;
    }
  }
};

export const typeDefs = /* GraphQL */ `
  """
  A generic type that allows valid object.
  """
  scalar JSON

  type Media {
    ${postFields}
    altText: String
    link: String
    sizes: MediaSizes
  }

  type MediaSizes {
     full: MediaSize
     large: MediaSize
     medium_large: MediaSize
     medium: MediaSize
     thumbnail: MediaSize
  }

  type MediaSize {
    height: Int!
    width: Int!
    url: String!
  }

  type Page {
    ${postFields}
    content: String
    excerpt: String
    featuredMedia: Media
  }

  type Post {
    ${postFields}
    content: String
    excerpt: String
    featuredMedia: Media
  }

  input PostFilter {
    ${postFilterFields}
    content: FilterableString
    excerpt: FilterableString
  }

  enum PostStatus {
    ACF_DISABLED
    ANY
    AUTO_DRAFT
    DRAFT
    FUTURE
    INHERIT
    PENDING
    PRIVATE
    PUBLISH
    REQUEST_COMPLETED
    REQUEST_CONFIRMED
    REQUEST_FAILED
    REQUEST_PENDING
    TRASH
  }

  extend type Query {
    allPage(filter: PostFilter): [Page]
    allPost(filter: PostFilter): [Post]
    page(id: ID, preview: Boolean, slug: String): Page
    post(id: ID, preview: Boolean, slug: String): Post
  }
`;
