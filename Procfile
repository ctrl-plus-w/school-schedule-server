web: node ./build/index.js
dev: npx babel-node ./src/index.js
sync: npm run sync
seed: npm run seed
build: rm -rf build && mkdir build && npx babel -d ./build ./src -s && node ./build/database/sync.js && node ./build/database/seed.js