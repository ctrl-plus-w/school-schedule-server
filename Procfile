web: node ./build/index.js
dev: npx babel-node ./src/index.js

build: rm -rf build && mkdir build && npx babel -d ./build ./src -s && node ./build/database/sync.js && node ./build/database/seed.js