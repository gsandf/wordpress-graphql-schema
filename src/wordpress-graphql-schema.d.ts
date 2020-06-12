export enum MediaSizeName {
  full = 'full',
  large = 'large',
  medium = 'medium',
  medium_large = 'medium_large',
  thumbnail = 'thumbnail'
}

export enum PostStatus {
  ACF_DISABLED = 'acf-disabled',
  ANY = 'any',
  AUTO_DRAFT = 'auto-draft',
  DRAFT = 'draft',
  FUTURE = 'future',
  INHERIT = 'inherit',
  PENDING = 'pending',
  PRIVATE = 'private',
  PUBLISH = 'publish',
  REQUEST_COMPLETED = 'request-completed',
  REQUEST_CONFIRMED = 'request-confirmed',
  REQUEST_FAILED = 'request-failed',
  REQUEST_PENDING = 'request-pending',
  TRASH = 'trash'
}

export interface Filterable<T> {
  eq: T;
  exists: boolean;
  gt: T;
  gte: T;
  in: T[];
  lt: T;
  lte: T;
  ne: T;
  nin: T[];
  regex?: T;
}

export interface PostFields {
  dateCreated: string;
  dateModified: string;
  id: string;
  path: string;
  slug: string;
  status: PostStatus;
  template: string;
  title: string;
  type: string;
}

export interface HTMLString {
  rendered: string;
}

export interface UnformattedPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: HTMLString;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: PostStatus;
  type: string;
  link: string;
  title?: HTMLString;
  content?: HTMLString;
  excerpt?: HTMLString;
  author: number;
  featured_media?: number;
  sticky?: boolean;
  template?: string;
}

export interface PostFilterFields {
  dateCreated: Filterable<string>;
  dateModified: Filterable<string>;
  id: Filterable<number>;
  path: Filterable<string>;
  slug: Filterable<string>;
  status: Filterable<string>;
  template: Filterable<string>;
  title: Filterable<string>;
  type: Filterable<string>;
}

export interface MediaSize {
  height: number;
  width: number;
  url: string;
}

export interface UnformattedMediaSize {
  file: string;
  height: number;
  mime_type: string;
  source_url: string;
  width: number;
}

export type MediaSizes = Record<MediaSizeName, MediaSize>;
export type UnformattedMediaSizes = Record<MediaSizeName, UnformattedMediaSize>;

export interface Media extends PostFields {
  altText: string;
  link: string;
  sizes: MediaSizes;
}

export interface UnformattedMedia extends UnformattedPost {
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: {
    file: string;
    height: number;
    width: number;
    sizes: UnformattedMediaSizes;
  };
}
