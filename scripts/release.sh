#!/usr/bin/env bash
HOME="~/nom/projects/live-broadcast"
cd $HOME
pwd

#!/usr/bin/env bash
#
echo "-----> Releasing live broadcast client" && (
  echo "npm run build" &&
  npm run build &&
  echo "git add dist/*" &&
  git add dist/* &&
  echo "git commit -am 'production build'" &&
  git config -l &&
  git commit -am "production build" &&
  echo "git push origin master" &&
  git push origin master &&
  echo "" &&
  echo "-----> Done."
) || (
  echo "! ERROR: Release failed."
)
