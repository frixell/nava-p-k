# Next Redux Slice Targets
- teachingpage (actions in `src/actions/teachingpage.ts`, reducer in `src/reducers/teachingpage.js`)
- homepage (reducer `src/reducers/homepage.js` plus homepage controllers)
- navigation (`src/reducers/navigation.js`)
- messages / newsletter / costumers reducers
- desktopGallery & mobileGallery reducers/actions (`src/reducers/*Gallery.js`, `src/actions/*Gallery.ts`)
- any remaining legacy reducers under `src/reducers` that haven’t moved to `src/store/slices`

# Upcoming Modernization Focus
## Drop Legacy Dependencies
- Remove jQuery usage (IP geolocation, DOM measurement) and replace with `fetch` + DOM APIs/ResizeObserver.
- Replace `XMLHttpRequest` and ad-hoc fetches in gallery/uploads with `fetch`/Cloudinary SDK helpers.
- Centralize Cloudinary upload/delete logic into a modern utility.
