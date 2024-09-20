module.exports = async ({github, context}) => {
    const image = process.env.IMAGE_NAME;
    console.log(`Cleaning up old tags for image: ${image}`);
    const tags = await github.rest.packages.getAllPackageVersionsForPackageOwnedByUser({
      package_type: 'container',
      username: context.repo.owner,
      package_name: image
    });
  
    const now = new Date();
    // We don't want to keep the images tagged with the commit hash at all.
    const daysToKeep = 0;
  
    for (const tag of tags.data) {
      // Is commit hash or starts with "sha"
      const isCommitHashTag = (/^[0-9a-f]{40}$/.test(tag.name) || tag.name.startsWith('sha')) && tag.name != 'main';
  
      if (isCommitHashTag) {
        const createdAt = new Date(tag.created_at);
        const daysOld = (now - createdAt) / (1000 * 60 * 60 * 24);
  
        if (daysOld > daysToKeep) {
          console.log(`Deleting tag: ${tag.name}`);
          try {
            await github.rest.packages.deletePackageVersionForAuthenticatedUser({
              package_type: 'container',
              package_name: image,
              package_version_id: tag.id
            });
          } catch (error) {
            console.log(`Failed to delete tag: ${tag.name}`);
            console.log(error);
          }
        }
      }
    }
  };