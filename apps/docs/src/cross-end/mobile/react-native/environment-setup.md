# 环境搭建

> 记录在`MacOS Ventura` 即 `MacOS 13` 上搭建本地开发环境

## 安装依赖

### `Homebrew` 安装

Homebrew是一款Mac OS平台下的软件包管理工具，拥有安装、卸载、更新、查看、搜索等很多实用的功能，Homebrew的安装命令如下：

```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

安装完成后，在终端输入

```shell
brew -v # 查看brew版本
```

若返回类似👇🏻，则说明已安装成功

```shell
Homebrew 3.6.6-34-gfaa9950 # 3.6.6-34-gfaa9950 版本号
Homebrew/homebrew-core (git revision fc6d9dbce2d; last commit 2022-10-23)
Homebrew/homebrew-cask (git revision 2698884634; last commit 2022-10-23)
```

### `Node` 安装

`Node.js®` 是一个开源、跨平台的 `JavaScript` 运行时环境。

```shell
brew install node # 安装 node

node -v # 查看 node 版本
v14.18.2
```

### `Yarn` 安装

`Yarn` 是 `Facebook` 提供的替代 `npm` 的工具，可以加速 `node` 模块的下载。

```shell
npm i yarn -g # 安装 yarn 包管理

yarn -v # 查看 yarn 版本
1.22.19
```

### `Watchman` 安装

`Watchman` 则是由 `Facebook` 提供的监视文件系统变更的工具。安装此工具可以提高开发时的性能（`packager` 可以快速捕捉文件的变化从而实现实时刷新）。

```shell
brew install watchman # 安装 watchman

watchman -v # 查看 yarn 版本
2022.10.17.00
```

### `Cocoapods` 安装

`CocoaPods` 是用 `Ruby` 编写的包管理器（可以理解为针对 `iOS` 的 `npm`）。从 0.60 版本开始 `react native` 的 `iOS` 版本需要使用 `CocoaPods` 来管理依赖。你可以使用下面的命令来安装 `CocoaPods`

```shell
brew install cocoapods # 安装 cocoapods
```

## 原生环境搭建

由于 `React Native` 项目的编译运行需要依赖原生平台，所以在搭建 `React Native` 开发环境过程中，需要事先搭建好原生 `Android`和 `iOS` 的开发环境。

### `Android` 原生环境

#### `JAVA` 环境配置

在搭建原生 `Android` 开发环境过程中，由于 `Android` 项目的开发和运行需要依赖 `Java` 环境，如果还没有安装 `Java` 环境，可以从 `JDK` 官网下载操作系统对应的 `JDK` 版本然后进行安装并配置环境变量。

``` zsh
# ~/.zshrc
# JAVA 的环境变量
# JAVA
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-19.jdk/Contents/Home
export CLASSPAHT=$JAVA_HOME/lib
export PATH=$JAVA_HOME/bin:$PATH
# JAVA END
```

安装并配置完成之后，需要刷新配置文件 `~/.zshrc`

```shell
source ~/.zshrc
```

然后可以使用 `java -version`命令来验证 `Java` 开发环境

```shell
java -version # java 版本

java version "19.0.1" 2022-10-18
Java(TM) SE Runtime Environment (build 19.0.1+10-21)
Java HotSpot(TM) 64-Bit Server VM (build 19.0.1+10-21, mixed mode, sharing)
```

#### `Android` 环境配置

安装 Android 开发工具 Android Studio 和 Android 开发套件 Android SDK Tools。

首先，从Android官网下载最新的Android Studio，安装完成之后，第一次启动会自动下载Android SDK，下载Android SDK需要在Android Studio的设置板中配置Android SDK Tools的路径，并配置 Android 的环境变量

```zsh
# Android 的环境变量
# Android
export ANDROID_HOME=/Users/[用户名]/Library/Android/sdk
export PATH=${PATH}:${ANDROID_HOME}/tools
export PATH=${PATH}:${ANDROID_HOME}/platform-tools
export PATH=${PATH}:${ANDROID_HOME}/emulator
export PATH=${PATH}:${ANDROID_HOME}/tools/bin
# Android END
```

### `iOS` 环境配置

`React Native` 目前需要 `Xcode 12` 或更高版本。你可以通过 `App Store` 或是到 `Apple` 开发者官网上下载。这一步骤会同时安装 `Xcode IDE、Xcode` 的命令行工具和 `iOS` 模拟器

#### Xcode 的命令行工具

启动 `Xcode`，并在 `Xcode -> Preferences | Setting -> Locations` 菜单中检查一下是否装有某个版本的 `Command Line Tools`。`Xcode` 的命令行工具中包含一些必须的工具，比如 `git` 等。
![Xcode Locations](/xcode-location.png)

## 创建项目

::: warning
你之前如果全局安装过旧的 `react-native-cli` 命令行工具，若不确定，可使用如下命令分别查看 `npm` 和 `yarn` 全局安装的包

```shell
npm list -g
yarn global list
```

如果存在请使用如下命令卸载掉以避免一些冲突：

```shell
npm uninstall -g react-native-cli @react-native-community/cli
yarn global remove react-native-cli @react-native-community/cli
```

:::

使用 `React Native` 内建的命令行工具来创建一个名为 `RN1` 的新项目。这个命令行工具不需要安装，可以直接用 `node` 自带的 `npx` 命令来使用（注意 `init` 命令默认会创建最新的版本）：

```shell
npx react-native init RN1
```

::: warning
初始化项目时，项目名称不能包含中文、空格和特殊符号，也不能使用常见关键字作为项目名，如 `class、native、new` 等。
:::
::: warning
0.60 及以上版本的原生依赖是通过 CocoaPods 集成安装的。CocoaPods 的源必须使用代理访问（镜像源也无效）。如果在 CocoaPods 的依赖安装步骤卡住（命令行停在 Installing CocoaPods dependencies 很久，或各种网络超时重置报错，或在 ios 目录中无法生成.xcworkspace 文件），请务必检查确定你的代理配置是否对命令行有效。
:::

### 可选参数

#### `--version` 指定版本

``` shell
#注意版本号必须精确到两个小数点
npx react-native init RN1 --version X.XX.X
```

#### `--template` 项目模版

``` shell
# 带有TypeScript配置的
npx react-native init AwesomeTSProject --template react-native-template-typescript
```
