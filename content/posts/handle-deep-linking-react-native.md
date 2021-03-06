---
title: 'How to handle Deep Links in a React Native app'
date: '2020-01-08'
slug: 'handle-deep-linking-react-native'
thumbnail: '/thumbnails/react.png'
tag: 'react-native'
canonicalUrl: 'https://blog.jscrambler.com/how-to-handle-deep-linking-in-a-react-native-app/'
---

![cover](https://i.imgur.com/cHaZZW8.jpg)

> Originally published at [Jscrambler](https://blog.jscrambler.com/how-to-handle-deep-linking-in-a-react-native-app/)

Deep Linking is a technique in which with a given URL or resource, a specific page or screen in mobile gets open. Navigating to this specific page or screen which can be under a series of hierarchical pages, hence the term "deep", is called deep linking.

In this tutorial, let us try to mimic a react-native demo app that opens a specific page based on the URI provided from an external source. To handle deep links, I am going to use an optimum solution provided by [`react-navigation`](https://reactnavigation.org/docs/) library.

You can find the complete code for the tutorial at this [GitHub repo](https://github.com/amandeepmittal/rnDeepLinkingDemo).

## Configure react-navigation in a React Native app

To start, create a new React Native project by running the following command:

```shell
react-native init rnDeepLinkingDemo

cd rnDeepLinkingDemo
```

To be able to support Deep linking via the navigation, add the required npm dependencies. Once the project directory has been generated from the above command, navigate inside the project folder from your terminal and install the following dependencies.

```shell
yarn add react-navigation react-navigation-stack
react-native-gesture-handler react-native-reanimated
react-native-screens@1.0.0-alpha.23
```

The next step is to link all the libraries you just installed. I am using React Native version greater than `0.60.x`. If you are using a lower version of React Native, please follow the instructions to link these libraries from [here](https://reactnavigation.org/docs/en/getting-started.html).

Only for the iOS devices, you just have to run the following set of commands.

```shell
cd ios
pod install
```

For the Android devices, add the following lines to the `android/app/build.gradle` file under `dependencies` section:

```groovy
implementation 'androidx.appcompat:appcompat:1.1.
0-rc01'
implementation 'androidx.
swiperefreshlayout:swiperefreshlayout:1.1.0-alpha02'
```

Then open `android/app/src/main/java/com/rndeeplinkdemo/MainActivity.java` file and add the following snippet:

```java
// Add this with other import statements
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
// Add this inside "class MainActivity"
@Override
protected ReactActivityDelegate createReactActivityDelegate() {
return new ReactActivityDelegate(this, getMainComponentName()) {
@Override
protected ReactRootView createRootView() {
return new RNGestureHandlerEnabledRootView(MainActivity.this);
}
};
}
```

## Create a Home & Details Screen

I am going to create all the screens for the rest of this tutorial inside the directory `src/screens`. To start with the Home screen, create a new file `Home.js`. inside the aforementioned path.

This screen is going to render a list of users from an array of mock data from a [placeholder API](https://jsonplaceholder.typicode.com/users) using a `FlatList` component. Each user is going to be wrapped inside a `TouchableOpacity`. The reason being, when an end-user press a user name from the list, this is going to contain the logic of navigating from `Home` screen to `Details` screen (_which we will add later_).

```js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(res => {
        setData(res);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const Separator = () => (
    <View
      style={{
        borderBottomColor: '#d3d3d3',
        borderBottomWidth: 1,
        marginTop: 10,
        marginBottom: 10
      }}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={Separator}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => alert('Nav to details screen')}>
              <Text style={{ fontSize: 24 }}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

export default Home;
```

For the details screen, for now, let us just display a text string. Create a new file called `Details.js`.

```js
import React from 'react';
import { View, Text } from 'react-native';

function Details() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Deep Link Screen</Text>
    </View>
  );
}
export default Details;
```

## Configure Deep Linking in React Navigation

To navigate from Home to Details screen, we need Stack Navigator from `react-navigation`. Create a new file called `index.js` inside `src/navigation` directory and import the following statements.

```js
import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Home from '../screens/Home';
import Details from '../screens/Details';
```

Create a stack navigator with `Home` as the initial screen.

```js
const MainApp = createStackNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      headerTitle: 'Home'
    }
  },
  Details: {
    screen: Details,
    navigationOptions: {
      headerTitle: 'Details'
    }
  }
});
```

To enable deep linking the current app requires an identifier to recognize the URI path from the external source to the screen of the app.

The library `react-navigation` provides path attribute for this. It tells the router relative path to match against the URL. Re-configure both the routes as following:

```js
const MainApp = createStackNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      headerTitle: 'Home'
    },
    path: 'home'
  },
  Details: {
    screen: Details,
    navigationOptions: {
      headerTitle: 'Details'
    },
    path: 'details/:userId'
  }
});
```

In the above snippet, the dynamic variable specified by `:userId` is passed to `details/`. This is going to allow the app to accept a dynamic value such as `details/1234`.

Next, add the configuration to the navigation to extract the path from the incoming URL from the external resource. This is done by `uriPrefix`. Add the following code snippet at the end of the file.

```js
export default () => {
  const prefix = 'myapp://';
  return <AppContainer uriPrefix={prefix} />;
};
```

Import this navigation module inside `App.js` file for it to work.

```js
import React from 'react';
import AppContainer from './src/navigation';

const App = () => {
  return <AppContainer />;
};

export default App;
```

## Configure URI scheme for native IOS apps

To make this work, you have to configure the native iOS and Android app to open URLs based on the prefix `myapp://`.

For iOS devices, open `Open ios/rnDeepLinkDemo/AppDelegate.m` file and add the following.

```c
// Add the header at the top of the file:
#import <React/RCTLinkingManager.h>
// Add this above the `@end`:
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url
 options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
 return [RCTLinkingManager application:app openURL:url options:options];
}
```

Open the `ios/rnDeepLinkingDemo.xcodeproj` in the Xcode app and select the app from the left navigation bar.

![jss1](https://i.imgur.com/oSuKeRy.png)

Open the **Info** tab.

![jss2](https://i.imgur.com/HXQ820b.png)

Next, go to the **URL Types**.

![jss3](https://i.imgur.com/yYUfDuN.png)

Click the **+** button and in identifier as well as **URL schemes** add `myapp`.

![jss4](https://i.imgur.com/sOe21B1.png)

Rebuild the react native binaries by running `react-native run-ios`.

For android users, you have to configure the external linking as well. Open `/android/app/src/main/AndroidManifest.xml` and set the value of `launchMode` to `singleTask`. Also, add a new `intent-filter`.

```xml
<activity
 android:name=".MainActivity"
 <!--set the below value-->
 android:launchMode="singleTask">
 <intent-filter>
 <action android:name="android.intent.action.MAIN" />
 <category android:name="android.intent.category.LAUNCHER" />
 </intent-filter>
 <!--Add the following-->

 <intent-filter>
 <action android:name="android.intent.action.VIEW" />
 <category android:name="android.intent.category.DEFAULT" />
 <category android:name="android.intent.category.BROWSABLE" />
 <data android:scheme="mychat" />
 </intent-filter>
</activity>
```

## Testing the app

Before you run the app on your choice of platform, make sure to re-build it using the specific command for the mobile OS as below:

```shell
# ios
react-native run-ios

# android
react-native run-android
```

The `Home` screen of the app is going to be like below.

![jss5](https://i.imgur.com/BDEtLkH.png)

Open a web browser in your simulator device, and run the URL `myapp://home`. It is going to ask you to whether open the external URI in the app associated as shown below.

![jss6](https://i.imgur.com/AQRBfDA.png)

Next, try entering the URL `myapp://details/1` and see what happens.

![jss7](https://i.imgur.com/PjoLbGh.gif)

Notice in the above demo that on visiting the last-mentioned URI, it opens the details screen in the app but fails to show details of the specific user. _Why?_ Because we have to add the business logic for it to recognize the dynamic parameters based on the external source.

## Access dynamic parameters in a route

To display information for each user when visiting `Details` screen, you have to pass the value of each item using navigation parameters. Open `Home.js` file and replace the value `onPress` prop on `TouchableOpacity` as shown below.

```js
<TouchableOpacity onPress={() => navigation.navigate('Details', { item })}>
  {/* rest of the code remains same*/}
</TouchableOpacity>
```

Next, open `Details.js`. To fetch the data from the placeholder API on initial render, let us use `useEffect` hook from React. This hook is going to behave like a good old lifecycle method `componentDidMount()`. It also allows that if the full `item` object is passed or not. If not, just grab the `userId` and request the API. Start by modifying the following import statement.

```js
import React, { useState, useEffect } from 'react';
```

Then, define a state variable `data` to store the incoming user information. Also, modify the contents of `return` in this component screen.

```js
function Details({ navigation }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const item = navigation.getParam('item', {});

    if (Object.keys(item).length === 0) {
      const userId = navigation.getParam('userId', 1);
      fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
        .then(res => res.json())
        .then(res => {
          const data = [];

          Object.keys(res).forEach(key => {
            data.push({ key, value: `${res[key]}` });
          });

          setData(data);
        });
    } else {
      const data = [];

      Object.keys(item).forEach(key => {
        data.push({ key, value: `${item[key]}` });
      });

      setData(data);
    }
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {data.map(data => (
        <Text
          style={{ fontSize: 20 }}
          key={data.key}
        >{`${data.key}: ${data.value}`}</Text>
      ))}
    </View>
  );
}
```

Here is the output you are going to get from the above modifications.

![jss8](https://i.imgur.com/6N7ibwU.gif)

Now, let us try to open a user's detail based on available ids from an external source such as a web browser.

![jss9](https://i.imgur.com/h2dj0BM.gif)

## Conclusion

That's it. You have now a complete demo of a React Native app that handles deep linking using `react-navigation`.
