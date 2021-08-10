// This file contains rules to read and remove all cookie versions.
import Cookies from "js-cookie";
import getStage from "./stage";

const stage = getStage();
const uuidV4RegEx = /[0-9A-Za-z]{8}-[0-9A-Za-z]{4}-4[0-9A-Za-z]{3}-[89ABab][0-9A-Za-z]{3}-[0-9A-Za-z]{12}/;

// Define migrations and set currentVersion based on length of migrations.
// Migrations are broken into two parts:
// 1. Read: attempt to read the userId and version
// 2. Remove: remove cookie
export const cookieVersion = [
  // Version 1
  // we are not setting cookie version based on values returned by this version of cookie
  {
    read: () => new Promise((resolve, reject) => {
      const userId = Cookies.get('chalmersUserId');
      if (!userId) {
        reject();
      } else if (userId.match(uuidV4RegEx)) {
        resolve({ userId, version: 1 });
      } else {
        reject()
      }
    })
  },
  // Version 2
  // we are not setting cookie version based on values returned by this version of cookie
  {
    // Migration from version 1 to 2
    migrate: userCookie => new Promise((resolve) => {
      const userObj = userCookie
      Cookies.remove('chalmersUserId');
      Cookies.remove('chalmersUserIdSchemaVersion');
      Cookies.set('chalmersUserId', userObj.userId, { domain: `${stage}.amplelabs.co` });
      resolve();
    }),
    read: () => new Promise((resolve, reject) => {
      const userId = Cookies.get('chalmersUserId', { domain: `${stage}.amplelabs.co` });
      if (!userId) {
        reject();
      } else if (userId.match(uuidV4RegEx)) {
        resolve({ userId, version: 2 });
      } else {
        reject()
      }
    }),
  },
  // Version 3
  {
    // Migration from version 2 to 3
    migrate: userCookie => new Promise((resolve) => {
      // First cookie version to have the version number embeded
      const suffix = stage === "" ? ".production" : stage
      const userObj = userCookie
      userObj.version = 3;
      // Include v2 removal logic because v1 cookies are getting picked up by v2 read logic.
      Cookies.remove('chalmersUserId');
      Cookies.remove('chalmersUserIdSchemaVersion');
      Cookies.remove(`chalmersUserId`, {
        domain: `${stage}.amplelabs.co`
      });
      Cookies.remove(`chalmersUserIdSchemaVersion`, {
        domain: `${stage}.amplelabs.co`
      });
      const userStr = JSON.stringify(userObj);
      Cookies.set(`chalmersUserId${suffix}`, btoa(userStr), { domain: `${stage}.amplelabs.co` });
      resolve();
    }),
    read: () => new Promise((resolve, reject) => {
      // Recover UserId from bug
      function recoverUserId(userObj) {
        if (!userObj.userId || !userObj.version) {
          return null
        }
        if (userObj.userId.match(uuidV4RegEx)) {
          return userObj
        }
        try {
          const decoded = atob(userObj.userId)
          const parsed = JSON.parse(decoded)
          if (parsed) {
            return recoverUserId({ userId: parsed.userId, version: userObj.version })
          }
        } catch (err) {
          return null
        }
        return null
      }
      const suffix = stage === "" ? ".production" : stage
      const userCookie = Cookies.get(`chalmersUserId${suffix}`, { domain: `${stage}.amplelabs.co` });
      if (!userCookie) {
        reject();
      } else {
        const userStr = atob(userCookie);
        const userObj = recoverUserId(JSON.parse(userStr));
        if (userObj.userId && userObj.version && userObj.userId.match(uuidV4RegEx)) {
          resolve(userObj)
        } else {
          reject()
        }
      }
    }),
  },
  // Version 4
  {
    // Migration from version 3 to 4
    migrate: userCookie => new Promise((resolve) => {
      const suffix = stage === "" ? ".production" : stage
      const userObj = userCookie
      userObj.version = 4;
      Cookies.remove(`chalmersUserId${suffix}`, {
        domain: `${stage}.amplelabs.co`
      });
      const userStr = JSON.stringify(userObj);
      Cookies.set(`chalmersUserId${stage}`, btoa(userStr), { domain: `${stage}.amplelabs.co` });
      resolve();
    }),
    read: () => new Promise((resolve, reject) => {
      // Recover UserId from bug
      function recoverUserId(userObj) {
        if (!userObj.userId || !userObj.version) {
          return null
        }
        if (userObj.userId.match(uuidV4RegEx)) {
          return userObj
        }
        try {
          const decoded = atob(userObj.userId)
          const parsed = JSON.parse(decoded)
          if (parsed) {
            return recoverUserId({ userId: parsed.userId, version: userObj.version })
          }
        } catch (err) {
          return null
        }
        return null
      }
      const userCookie = Cookies.get(`chalmersUserId${stage}`, { domain: `${stage}.amplelabs.co` });
      if (!userCookie) {
        reject();
      } else {
        const userStr = atob(userCookie);
        const userObj = recoverUserId(JSON.parse(userStr));
        if (userObj.userId && userObj.version && userObj.userId.match(uuidV4RegEx)) {
          resolve(userObj)
        } else {
          reject()
        }
      }
    }),
  },
  // Version 5 (current)
  {
    // Migration from version 4 to 5
    migrate: userCookie => new Promise((resolve) => {
      const userObj = userCookie
      userObj.version += 1;
      Cookies.remove(`chalmersUserId${stage}`, {
        domain: `${stage}.amplelabs.co`
      });
      const userStr = JSON.stringify(userObj);
      Cookies.set(`chalmersUserId${stage}`, btoa(userStr), { domain: `${stage}.amplelabs.co` });
      resolve();
    }),
    read: () => new Promise((resolve, reject) => {
      // Read
      const userCookie = Cookies.get(`chalmersUserId${stage}`, { domain: `${stage}.amplelabs.co` });
      if (!userCookie) {
        reject();
      } else {
        const userStr = atob(userCookie);
        const userObj = JSON.parse(userStr);
        if (userObj.userId && userObj.version && userObj.userId.match(uuidV4RegEx)) {
          resolve(userObj)
        } else {
          reject()
        }
      }
    }),
  }
];
export const currentVersion = cookieVersion.length;

export async function getUserCookie() {
  // set default response
  const userObj = { userId: null, version: 0 };
  // attempt to read latest cookie version:
  // - on success, return userObj
  // - on failure, loop through previous cookie versions
  // if version read is < current version: run migrations to transform cookie to currentVersion
  for (let i = currentVersion; i > 0; i--) {
    // cookie is latest version, no migrations needed
    if (userObj.userId && userObj.version === currentVersion) {
      break;
    } else {
      // eslint-disable-next-line no-await-in-loop
      await cookieVersion[i - 1].read()
        .then((cookie) => {
          userObj.userId = cookie.userId;
          userObj.version = cookie.version;
          // This prevents running non-existent migrations
          if (userObj.version < currentVersion) {
            const versionDiff = currentVersion - userObj.version;
            for (let k = versionDiff; k > 0; k--) {
              cookieVersion[currentVersion - k].migrate(userObj)
            }
          }
        }).catch(() => {
          // Failed to read cookie - do nothing
        });
    }
  }
  return userObj;
}
export function setUserCookie(userId) {
  const userObj = { userId, version: currentVersion };
  const userStr = JSON.stringify(userObj);
  Cookies.set(`chalmersUserId${stage}`, btoa(userStr), {
    domain: `${stage}.amplelabs.co`,
    expires: 3650
  });
}
