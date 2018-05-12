# Banquet Management System

## Functionalities

Please check out the [demo video](https://youtu.be/y6ZLjbwYiiI) of the system.

## Installation Guide

### 1- Install `Node.js` and `npm`

```
# Set up Node.js
curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt-get install nodejs
sudo apt-get install build-essential
```

### 2- Install Firebase CLI and Login

```
npm install -g firebase-tools
firebase login
```

### 3- Local testing

Under the root directory of this project, type following code in the terminal.

```
firebase serve --only hosting
```

Then open the `localhost:5000` in the browser to test the local running version.

### 4- (Optional) Deploy on-line

> Important Notes: this operation will **wipe out** the deployed online version, do not deploy when you are testing.

```
Firebase deploy --only hosting
```

## Authors

[Yiran CHENG](mailto:yiran.cheng@connect.polyu.hk)
[Derek Mingyu MA](http://derek.ma)
[Yufan ZHUANG](mailto:evan.zhuang@connect.polyu.hk)

This is an assignment for Spring 2018 COMP3421 Web Application Design and Development at Department of Computing of The Hong Kong Polytechnic University.


