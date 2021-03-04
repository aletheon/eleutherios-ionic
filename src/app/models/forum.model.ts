export interface Forum {
  forumId: string, // unique id
  uid: string, // id of the user who created this forum
  parentId: string, // id of the forum, that this forum belongs to
  parentUid: string, // id of the user who owns the parent forum
  type: string, // [public or private]
  title: string, // title of the forum
  title_lowercase: string, // for case insensitive searching
  description: string, // description of the forum
  website: string, // website of the forum
  indexed: boolean, // whether this service is indexed or hidden
  includeDescriptionInDetailPage: boolean,
  includeImagesInDetailPage: boolean,
  includeTagsInDetailPage: boolean,
  lastUpdateDate: object,
  creationDate: object
}
