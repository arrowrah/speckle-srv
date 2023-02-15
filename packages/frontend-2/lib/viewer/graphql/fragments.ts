import { graphql } from '~~/lib/common/generated/gql'

export const viewerCommentThreadFragment = graphql(`
  fragment ViewerCommentThread on Comment {
    ...ViewerCommentsListItem
    ...ViewerCommentBubblesData
  }
`)

export const viewerReplyFragment = graphql(`
  fragment ViewerCommentsReplyItem on Comment {
    id
    rawText
    text {
      doc
    }
    author {
      ...LimitedUserAvatar
    }
    createdAt
  }
`)
