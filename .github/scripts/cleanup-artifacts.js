module.exports = async ({ github, context }) => {
  const image = process.env.IMAGE_NAME;
  console.log(`Cleaning up old tags for image: ${image}`);
  const packageVersions = await github.rest.packages.getAllPackageVersionsForPackageOwnedByUser({
      package_type: 'container',
      username: context.repo.owner,
      package_name: image
  });

  const now = new Date();
  const daysToKeep = 0; // We don't want to keep images tagged with the commit hash

  for (const packageVersion of packageVersions.data) {
      const tags = packageVersion.metadata.container.tags;

      for (const tag of tags) {
          const isCommitHashTag = (/^[0-9a-f]{40}$/.test(tag) || tag.startsWith('sha')) && tag !== 'main';

          if (isCommitHashTag) {
              const createdAt = new Date(packageVersion.created_at);
              const daysOld = (now - createdAt) / (1000 * 60 * 60 * 24);

              if (daysOld > daysToKeep) {
                  console.log(`Deleting tag: ${tag} (package version ID: ${packageVersion.id})`);
                  try {
                      await github.rest.packages.deletePackageVersionForAuthenticatedUser({
                          package_type: 'container',
                          package_name: image,
                          package_version_id: packageVersion.id
                      });
                  } catch (error) {
                      console.log(`Failed to delete tag: ${tag} (package version ID: ${packageVersion.id})`);
                      console.log(error);
                  }
              }
          }
      }
  }
};