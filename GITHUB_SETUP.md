# Maintaining the public ArcSecs repository

Repository: https://github.com/MichaelKappel/ArcSecs.com (public).

Use GitHub Desktop to clone, pull, edit, review diffs, commit and push. Do not force-push. Keep local credentials, private memory and unpublished backups outside the repository. Review staged changes and history for sensitive material; .gitignore is not a security boundary.

For a versioned release, use GitHub Releases, select the intended commit or branch, create an immutable-purpose version tag, and describe the scientific and software versions separately. See RELEASE_NOTES.md for proposed release notes. Link an actual Zenodo DOI only after it exists.

Generate a current SHA-256 manifest using tools/git_snapshot_sha256.py from a local clone; the original staging checksums are historical. GitHub Pages cannot execute WordPress PHP; use a separate tested WordPress deployment.

## Updating from the consolidated v3.142.0 source archive

1. In GitHub Desktop, fetch/pull main and create a release preparation branch. The archive was assembled against public main 5ea8a67857eb838ca367dd84379fb4ee442c524f (verify it has not advanced).
2. Extract the archive outside the clone. Copy the contents of the ArcSecs.com directory into the clone (including hidden .github). Do not replace the clone's .git directory; the source archive intentionally contains no Git history. Replace the theme and plugin subdirectories with their exact archive directories, rather than retaining obsolete files. Review all changes and deletions.
3. The repository .gitignore excludes ZIPs by default. The single intentional public bundled corpus ZIP is explicitly allowed. Review other ignored files and do not stage private archives. Use GitHub Desktop to commit and push, then check Actions and merge after review. If the ZIP or another expected asset is absent, do not publish an incomplete release.
4. After quality gates and staging verification, create a GitHub Release with tag v3.142.0 (if unused). Attach the separate WordPress theme and plugin ZIPs and optional test evidence, not an unreviewed private archive.
