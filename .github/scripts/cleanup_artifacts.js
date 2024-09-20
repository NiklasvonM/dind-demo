module.exports = async ({github, context, core}) => {
    const image = `${context.repo.owner.login}/${process.env.IMAGE_NAME}`;
    const tags = await github.rest.packages.getAllPackageVersionsForPackageOwnedByUser({
      package_type: 'container',
      username: context.repo.owner,
      package_name: image
    });
  
    const now = new Date();
    // We don't want to keep the images tagged with the commit hash at all.
    const daysToKeep = 0;
  
    for (const tag of tags.data) {
      const isCommitHashTag = /^[0-9a-f]{40}$/.test(tag.name);
  
      if (isCommitHashTag) {
        const createdAt = new Date(tag.created_at);
        const daysOld = (now - createdAt) / (1000 * 60 * 60 * 24);
  
        if (daysOld > daysToKeep) {
          console.log(`Deleting tag: ${tag.name}`);
          await github.rest.packages.deletePackageVersionForAuthenticatedUser({
            package_type: 'container',
            username: context.repo.owner,
            package_name: image,
            package_version_id: tag.id
          });
        }
      }
    }
  };