# GitHub import (private first)

Create a new **private**, empty repository `ArcSecs` under `MichaelKappel` at https://github.com/new. Do not add a README, license or .gitignore on the site: these are supplied in the working tree. From the extracted repository root:

```sh
git init -b main
git add .
git status --short
git commit -m "Stage integrated ArcSecs research, book and website"
git remote add origin https://github.com/MichaelKappel/ArcSecs.git
git push -u origin main
```

Authenticate with GitHub CLI or GitHub Desktop if necessary; never put a token in the repository. If a repository already contains commits, clone it and copy the package into a new branch rather than force-pushing. GitHub Desktop can also add the extracted folder as a local repository and publish privately.

Before changing visibility to public, confirm the rights and KDP exclusivity review, audit third-party content and remove any non-cleared artifacts. Do not assign a blanket license. Link the final Zenodo DOI and create a versioned release only when the approved record exists.
