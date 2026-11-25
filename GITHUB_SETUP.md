# Maintaining the public ArcSecs repository

Repository: https://github.com/MichaelKappel/ArcSecs.com (public).

Use GitHub Desktop to clone, pull, edit, review diffs, commit and push. Do not force-push. Keep local credentials, private memory and unpublished backups outside the repository. Review staged changes and history for sensitive material; .gitignore is not a security boundary.

For a versioned release, use GitHub Releases, select the intended commit or branch, create an immutable-purpose version tag, and describe the scientific and software versions separately. See RELEASE_NOTES.md for proposed first public release notes. Link an actual Zenodo DOI only after it exists.

Generate a current SHA-256 manifest using tools/git_snapshot_sha256.py from a local clone; the original staging checksums are historical. GitHub Pages cannot execute WordPress PHP; use a separate tested WordPress deployment.
