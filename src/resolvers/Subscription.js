/**

  Goal: Create a subscription for new posts
  1. Define "post" subscription. No arguements are necessary. Response should be a post object.
  2. Setup the resolver for post. Since there are no args, a channel name like "post" is fine.
  3. Modify the mutation for creating a post to publish the new post data.
    - Only call pubsub.pubish if the post had "published" set to true.
    - Don't worry about updatePost or deletePost.
*/

const Subscription = {
  comment: {
    subscribe(parent, args, {db, pubsub}, info) {
      const {postId} = args;
      const post = db.Posts.find(post => post.id === postId && post.published);

      if(!post) throw new Error("Post not found");

      return pubsub.asyncIterator(`comment ${postId}`);

    }
  },
  post: {
    subscribe(parent, args, {db, pubsub}, info) {
      return pubsub.asyncIterator('post');
    }
  }
}

export default Subscription;
