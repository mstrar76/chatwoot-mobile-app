const { createRunOncePlugin, withEntitlementsPlist } = require('@expo/config-plugins');

// A free (personal team) Apple developer account cannot sign the push notification or
// associated-domains capabilities. Other plugins (Firebase messaging, notifee) add
// `aps-environment` on their own, so strip both entitlements last when building for a
// personal team (EXPO_PUBLIC_IOS_PERSONAL_TEAM=true). Push does not work on such builds.
const withIosPersonalTeam = config => {
  if (process.env.EXPO_PUBLIC_IOS_PERSONAL_TEAM !== 'true') {
    return config;
  }
  return withEntitlementsPlist(config, mod => {
    delete mod.modResults['aps-environment'];
    delete mod.modResults['com.apple.developer.associated-domains'];
    return mod;
  });
};

module.exports = createRunOncePlugin(withIosPersonalTeam, 'with-ios-personal-team', '1.0.0');
