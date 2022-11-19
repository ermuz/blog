import{_ as s,c as a,o as n,d as e}from"./app.dd3b9e0b.js";const l="/blog/xcode-location.png",h=JSON.parse('{"title":"\u73AF\u5883\u642D\u5EFA","description":"","frontmatter":{},"headers":[{"level":2,"title":"\u5B89\u88C5\u4F9D\u8D56","slug":"\u5B89\u88C5\u4F9D\u8D56","link":"#\u5B89\u88C5\u4F9D\u8D56","children":[{"level":3,"title":"Homebrew \u5B89\u88C5","slug":"homebrew-\u5B89\u88C5","link":"#homebrew-\u5B89\u88C5","children":[]},{"level":3,"title":"Node \u5B89\u88C5","slug":"node-\u5B89\u88C5","link":"#node-\u5B89\u88C5","children":[]},{"level":3,"title":"Yarn \u5B89\u88C5","slug":"yarn-\u5B89\u88C5","link":"#yarn-\u5B89\u88C5","children":[]},{"level":3,"title":"Watchman \u5B89\u88C5","slug":"watchman-\u5B89\u88C5","link":"#watchman-\u5B89\u88C5","children":[]},{"level":3,"title":"Cocoapods \u5B89\u88C5","slug":"cocoapods-\u5B89\u88C5","link":"#cocoapods-\u5B89\u88C5","children":[]}]},{"level":2,"title":"\u539F\u751F\u73AF\u5883\u642D\u5EFA","slug":"\u539F\u751F\u73AF\u5883\u642D\u5EFA","link":"#\u539F\u751F\u73AF\u5883\u642D\u5EFA","children":[{"level":3,"title":"Android \u539F\u751F\u73AF\u5883","slug":"android-\u539F\u751F\u73AF\u5883","link":"#android-\u539F\u751F\u73AF\u5883","children":[]},{"level":3,"title":"iOS \u73AF\u5883\u914D\u7F6E","slug":"ios-\u73AF\u5883\u914D\u7F6E","link":"#ios-\u73AF\u5883\u914D\u7F6E","children":[]}]},{"level":2,"title":"\u521B\u5EFA\u9879\u76EE","slug":"\u521B\u5EFA\u9879\u76EE","link":"#\u521B\u5EFA\u9879\u76EE","children":[{"level":3,"title":"\u53EF\u9009\u53C2\u6570","slug":"\u53EF\u9009\u53C2\u6570","link":"#\u53EF\u9009\u53C2\u6570","children":[]}]}],"relativePath":"cross-end/mobile/react-native/environment-setup.md","lastUpdated":1667182864000}'),o={name:"cross-end/mobile/react-native/environment-setup.md"},p=e(`<h1 id="\u73AF\u5883\u642D\u5EFA" tabindex="-1">\u73AF\u5883\u642D\u5EFA <a class="header-anchor" href="#\u73AF\u5883\u642D\u5EFA" aria-hidden="true">#</a></h1><blockquote><p>\u8BB0\u5F55\u5728<code>MacOS Ventura</code> \u5373 <code>MacOS 13</code> \u4E0A\u642D\u5EFA\u672C\u5730\u5F00\u53D1\u73AF\u5883</p></blockquote><h2 id="\u5B89\u88C5\u4F9D\u8D56" tabindex="-1">\u5B89\u88C5\u4F9D\u8D56 <a class="header-anchor" href="#\u5B89\u88C5\u4F9D\u8D56" aria-hidden="true">#</a></h2><h3 id="homebrew-\u5B89\u88C5" tabindex="-1"><code>Homebrew</code> \u5B89\u88C5 <a class="header-anchor" href="#homebrew-\u5B89\u88C5" aria-hidden="true">#</a></h3><p>Homebrew\u662F\u4E00\u6B3EMac OS\u5E73\u53F0\u4E0B\u7684\u8F6F\u4EF6\u5305\u7BA1\u7406\u5DE5\u5177\uFF0C\u62E5\u6709\u5B89\u88C5\u3001\u5378\u8F7D\u3001\u66F4\u65B0\u3001\u67E5\u770B\u3001\u641C\u7D22\u7B49\u5F88\u591A\u5B9E\u7528\u7684\u529F\u80FD\uFF0CHomebrew\u7684\u5B89\u88C5\u547D\u4EE4\u5982\u4E0B\uFF1A</p><div class="language-shell line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;">/bin/bash -c </span><span style="color:#89DDFF;">&quot;$(</span><span style="color:#C3E88D;">curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh</span><span style="color:#89DDFF;">)&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br></div></div><p>\u5B89\u88C5\u5B8C\u6210\u540E\uFF0C\u5728\u7EC8\u7AEF\u8F93\u5165</p><div class="language-shell line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;">brew -v </span><span style="color:#676E95;"># \u67E5\u770Bbrew\u7248\u672C</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br></div></div><p>\u82E5\u8FD4\u56DE\u7C7B\u4F3C\u{1F447}\u{1F3FB}\uFF0C\u5219\u8BF4\u660E\u5DF2\u5B89\u88C5\u6210\u529F</p><div class="language-shell line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;">Homebrew 3.6.6-34-gfaa9950 </span><span style="color:#676E95;"># 3.6.6-34-gfaa9950 \u7248\u672C\u53F7</span></span>
<span class="line"><span style="color:#A6ACCD;">Homebrew/homebrew-core </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">git revision fc6d9dbce2d</span><span style="color:#89DDFF;">;</span><span style="color:#A6ACCD;"> last commit 2022-10-23</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">Homebrew/homebrew-cask </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">git revision 2698884634</span><span style="color:#89DDFF;">;</span><span style="color:#A6ACCD;"> last commit 2022-10-23</span><span style="color:#89DDFF;">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h3 id="node-\u5B89\u88C5" tabindex="-1"><code>Node</code> \u5B89\u88C5 <a class="header-anchor" href="#node-\u5B89\u88C5" aria-hidden="true">#</a></h3><p><code>Node.js\xAE</code> \u662F\u4E00\u4E2A\u5F00\u6E90\u3001\u8DE8\u5E73\u53F0\u7684 <code>JavaScript</code> \u8FD0\u884C\u65F6\u73AF\u5883\u3002</p><div class="language-shell line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;">brew install node </span><span style="color:#676E95;"># \u5B89\u88C5 node</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">node -v </span><span style="color:#676E95;"># \u67E5\u770B node \u7248\u672C</span></span>
<span class="line"><span style="color:#A6ACCD;">v14.18.2</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><h3 id="yarn-\u5B89\u88C5" tabindex="-1"><code>Yarn</code> \u5B89\u88C5 <a class="header-anchor" href="#yarn-\u5B89\u88C5" aria-hidden="true">#</a></h3><p><code>Yarn</code> \u662F <code>Facebook</code> \u63D0\u4F9B\u7684\u66FF\u4EE3 <code>npm</code> \u7684\u5DE5\u5177\uFF0C\u53EF\u4EE5\u52A0\u901F <code>node</code> \u6A21\u5757\u7684\u4E0B\u8F7D\u3002</p><div class="language-shell line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;">npm i yarn -g </span><span style="color:#676E95;"># \u5B89\u88C5 yarn \u5305\u7BA1\u7406</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">yarn -v </span><span style="color:#676E95;"># \u67E5\u770B yarn \u7248\u672C</span></span>
<span class="line"><span style="color:#A6ACCD;">1.22.19</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><h3 id="watchman-\u5B89\u88C5" tabindex="-1"><code>Watchman</code> \u5B89\u88C5 <a class="header-anchor" href="#watchman-\u5B89\u88C5" aria-hidden="true">#</a></h3><p><code>Watchman</code> \u5219\u662F\u7531 <code>Facebook</code> \u63D0\u4F9B\u7684\u76D1\u89C6\u6587\u4EF6\u7CFB\u7EDF\u53D8\u66F4\u7684\u5DE5\u5177\u3002\u5B89\u88C5\u6B64\u5DE5\u5177\u53EF\u4EE5\u63D0\u9AD8\u5F00\u53D1\u65F6\u7684\u6027\u80FD\uFF08<code>packager</code> \u53EF\u4EE5\u5FEB\u901F\u6355\u6349\u6587\u4EF6\u7684\u53D8\u5316\u4ECE\u800C\u5B9E\u73B0\u5B9E\u65F6\u5237\u65B0\uFF09\u3002</p><div class="language-shell line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;">brew install watchman </span><span style="color:#676E95;"># \u5B89\u88C5 watchman</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">watchman -v </span><span style="color:#676E95;"># \u67E5\u770B yarn \u7248\u672C</span></span>
<span class="line"><span style="color:#A6ACCD;">2022.10.17.00</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><h3 id="cocoapods-\u5B89\u88C5" tabindex="-1"><code>Cocoapods</code> \u5B89\u88C5 <a class="header-anchor" href="#cocoapods-\u5B89\u88C5" aria-hidden="true">#</a></h3><p><code>CocoaPods</code> \u662F\u7528 <code>Ruby</code> \u7F16\u5199\u7684\u5305\u7BA1\u7406\u5668\uFF08\u53EF\u4EE5\u7406\u89E3\u4E3A\u9488\u5BF9 <code>iOS</code> \u7684 <code>npm</code>\uFF09\u3002\u4ECE 0.60 \u7248\u672C\u5F00\u59CB <code>react native</code> \u7684 <code>iOS</code> \u7248\u672C\u9700\u8981\u4F7F\u7528 <code>CocoaPods</code> \u6765\u7BA1\u7406\u4F9D\u8D56\u3002\u4F60\u53EF\u4EE5\u4F7F\u7528\u4E0B\u9762\u7684\u547D\u4EE4\u6765\u5B89\u88C5 <code>CocoaPods</code></p><div class="language-shell line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;">brew install cocoapods </span><span style="color:#676E95;"># \u5B89\u88C5 cocoapods</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br></div></div><h2 id="\u539F\u751F\u73AF\u5883\u642D\u5EFA" tabindex="-1">\u539F\u751F\u73AF\u5883\u642D\u5EFA <a class="header-anchor" href="#\u539F\u751F\u73AF\u5883\u642D\u5EFA" aria-hidden="true">#</a></h2><p>\u7531\u4E8E <code>React Native</code> \u9879\u76EE\u7684\u7F16\u8BD1\u8FD0\u884C\u9700\u8981\u4F9D\u8D56\u539F\u751F\u5E73\u53F0\uFF0C\u6240\u4EE5\u5728\u642D\u5EFA <code>React Native</code> \u5F00\u53D1\u73AF\u5883\u8FC7\u7A0B\u4E2D\uFF0C\u9700\u8981\u4E8B\u5148\u642D\u5EFA\u597D\u539F\u751F <code>Android</code>\u548C <code>iOS</code> \u7684\u5F00\u53D1\u73AF\u5883\u3002</p><h3 id="android-\u539F\u751F\u73AF\u5883" tabindex="-1"><code>Android</code> \u539F\u751F\u73AF\u5883 <a class="header-anchor" href="#android-\u539F\u751F\u73AF\u5883" aria-hidden="true">#</a></h3><h4 id="java-\u73AF\u5883\u914D\u7F6E" tabindex="-1"><code>JAVA</code> \u73AF\u5883\u914D\u7F6E <a class="header-anchor" href="#java-\u73AF\u5883\u914D\u7F6E" aria-hidden="true">#</a></h4><p>\u5728\u642D\u5EFA\u539F\u751F <code>Android</code> \u5F00\u53D1\u73AF\u5883\u8FC7\u7A0B\u4E2D\uFF0C\u7531\u4E8E <code>Android</code> \u9879\u76EE\u7684\u5F00\u53D1\u548C\u8FD0\u884C\u9700\u8981\u4F9D\u8D56 <code>Java</code> \u73AF\u5883\uFF0C\u5982\u679C\u8FD8\u6CA1\u6709\u5B89\u88C5 <code>Java</code> \u73AF\u5883\uFF0C\u53EF\u4EE5\u4ECE <code>JDK</code> \u5B98\u7F51\u4E0B\u8F7D\u64CD\u4F5C\u7CFB\u7EDF\u5BF9\u5E94\u7684 <code>JDK</code> \u7248\u672C\u7136\u540E\u8FDB\u884C\u5B89\u88C5\u5E76\u914D\u7F6E\u73AF\u5883\u53D8\u91CF\u3002</p><div class="language-zsh line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">zsh</span><pre class="shiki"><code><span class="line"><span style="color:#676E95;"># ~/.zshrc</span></span>
<span class="line"><span style="color:#676E95;"># JAVA \u7684\u73AF\u5883\u53D8\u91CF</span></span>
<span class="line"><span style="color:#676E95;"># JAVA</span></span>
<span class="line"><span style="color:#C792EA;">export</span><span style="color:#A6ACCD;"> JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-19.jdk/Contents/Home</span></span>
<span class="line"><span style="color:#C792EA;">export</span><span style="color:#A6ACCD;"> CLASSPAHT=</span><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;">JAVA_HOME/lib</span></span>
<span class="line"><span style="color:#C792EA;">export</span><span style="color:#A6ACCD;"> PATH=</span><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;">JAVA_HOME/bin:</span><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;">PATH</span></span>
<span class="line"><span style="color:#676E95;"># JAVA END</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p>\u5B89\u88C5\u5E76\u914D\u7F6E\u5B8C\u6210\u4E4B\u540E\uFF0C\u9700\u8981\u5237\u65B0\u914D\u7F6E\u6587\u4EF6 <code>~/.zshrc</code></p><div class="language-shell line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki"><code><span class="line"><span style="color:#82AAFF;">source</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">~</span><span style="color:#A6ACCD;">/.zshrc</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br></div></div><p>\u7136\u540E\u53EF\u4EE5\u4F7F\u7528 <code>java -version</code>\u547D\u4EE4\u6765\u9A8C\u8BC1 <code>Java</code> \u5F00\u53D1\u73AF\u5883</p><div class="language-shell line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;">java -version </span><span style="color:#676E95;"># java \u7248\u672C</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">java version </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">19.0.1</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> 2022-10-18</span></span>
<span class="line"><span style="color:#A6ACCD;">Java</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">TM</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> SE Runtime Environment </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">build 19.0.1+10-21</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">Java HotSpot</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">TM</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> 64-Bit Server VM </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">build 19.0.1+10-21, mixed mode, sharing</span><span style="color:#89DDFF;">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h4 id="android-\u73AF\u5883\u914D\u7F6E" tabindex="-1"><code>Android</code> \u73AF\u5883\u914D\u7F6E <a class="header-anchor" href="#android-\u73AF\u5883\u914D\u7F6E" aria-hidden="true">#</a></h4><p>\u5B89\u88C5 Android \u5F00\u53D1\u5DE5\u5177 Android Studio \u548C Android \u5F00\u53D1\u5957\u4EF6 Android SDK Tools\u3002</p><p>\u9996\u5148\uFF0C\u4ECEAndroid\u5B98\u7F51\u4E0B\u8F7D\u6700\u65B0\u7684Android Studio\uFF0C\u5B89\u88C5\u5B8C\u6210\u4E4B\u540E\uFF0C\u7B2C\u4E00\u6B21\u542F\u52A8\u4F1A\u81EA\u52A8\u4E0B\u8F7DAndroid SDK\uFF0C\u4E0B\u8F7DAndroid SDK\u9700\u8981\u5728Android Studio\u7684\u8BBE\u7F6E\u677F\u4E2D\u914D\u7F6EAndroid SDK Tools\u7684\u8DEF\u5F84\uFF0C\u5E76\u914D\u7F6E Android \u7684\u73AF\u5883\u53D8\u91CF</p><div class="language-zsh line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">zsh</span><pre class="shiki"><code><span class="line"><span style="color:#676E95;"># Android \u7684\u73AF\u5883\u53D8\u91CF</span></span>
<span class="line"><span style="color:#676E95;"># Android</span></span>
<span class="line"><span style="color:#C792EA;">export</span><span style="color:#A6ACCD;"> ANDROID_HOME=/Users/</span><span style="color:#89DDFF;">[</span><span style="color:#A6ACCD;">\u7528\u6237\u540D</span><span style="color:#89DDFF;">]</span><span style="color:#A6ACCD;">/Library/Android/sdk</span></span>
<span class="line"><span style="color:#C792EA;">export</span><span style="color:#A6ACCD;"> PATH=</span><span style="color:#89DDFF;">\${</span><span style="color:#A6ACCD;">PATH</span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">:</span><span style="color:#89DDFF;">\${</span><span style="color:#A6ACCD;">ANDROID_HOME</span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">/tools</span></span>
<span class="line"><span style="color:#C792EA;">export</span><span style="color:#A6ACCD;"> PATH=</span><span style="color:#89DDFF;">\${</span><span style="color:#A6ACCD;">PATH</span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">:</span><span style="color:#89DDFF;">\${</span><span style="color:#A6ACCD;">ANDROID_HOME</span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">/platform-tools</span></span>
<span class="line"><span style="color:#C792EA;">export</span><span style="color:#A6ACCD;"> PATH=</span><span style="color:#89DDFF;">\${</span><span style="color:#A6ACCD;">PATH</span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">:</span><span style="color:#89DDFF;">\${</span><span style="color:#A6ACCD;">ANDROID_HOME</span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">/emulator</span></span>
<span class="line"><span style="color:#C792EA;">export</span><span style="color:#A6ACCD;"> PATH=</span><span style="color:#89DDFF;">\${</span><span style="color:#A6ACCD;">PATH</span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">:</span><span style="color:#89DDFF;">\${</span><span style="color:#A6ACCD;">ANDROID_HOME</span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">/tools/bin</span></span>
<span class="line"><span style="color:#676E95;"># Android END</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><h3 id="ios-\u73AF\u5883\u914D\u7F6E" tabindex="-1"><code>iOS</code> \u73AF\u5883\u914D\u7F6E <a class="header-anchor" href="#ios-\u73AF\u5883\u914D\u7F6E" aria-hidden="true">#</a></h3><p><code>React Native</code> \u76EE\u524D\u9700\u8981 <code>Xcode 12</code> \u6216\u66F4\u9AD8\u7248\u672C\u3002\u4F60\u53EF\u4EE5\u901A\u8FC7 <code>App Store</code> \u6216\u662F\u5230 <code>Apple</code> \u5F00\u53D1\u8005\u5B98\u7F51\u4E0A\u4E0B\u8F7D\u3002\u8FD9\u4E00\u6B65\u9AA4\u4F1A\u540C\u65F6\u5B89\u88C5 <code>Xcode IDE\u3001Xcode</code> \u7684\u547D\u4EE4\u884C\u5DE5\u5177\u548C <code>iOS</code> \u6A21\u62DF\u5668</p><h4 id="xcode-\u7684\u547D\u4EE4\u884C\u5DE5\u5177" tabindex="-1">Xcode \u7684\u547D\u4EE4\u884C\u5DE5\u5177 <a class="header-anchor" href="#xcode-\u7684\u547D\u4EE4\u884C\u5DE5\u5177" aria-hidden="true">#</a></h4><p>\u542F\u52A8 <code>Xcode</code>\uFF0C\u5E76\u5728 <code>Xcode -&gt; Preferences | Setting -&gt; Locations</code> \u83DC\u5355\u4E2D\u68C0\u67E5\u4E00\u4E0B\u662F\u5426\u88C5\u6709\u67D0\u4E2A\u7248\u672C\u7684 <code>Command Line Tools</code>\u3002<code>Xcode</code> \u7684\u547D\u4EE4\u884C\u5DE5\u5177\u4E2D\u5305\u542B\u4E00\u4E9B\u5FC5\u987B\u7684\u5DE5\u5177\uFF0C\u6BD4\u5982 <code>git</code> \u7B49\u3002 <img src="`+l+`" alt="Xcode Locations"></p><h2 id="\u521B\u5EFA\u9879\u76EE" tabindex="-1">\u521B\u5EFA\u9879\u76EE <a class="header-anchor" href="#\u521B\u5EFA\u9879\u76EE" aria-hidden="true">#</a></h2><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>\u4F60\u4E4B\u524D\u5982\u679C\u5168\u5C40\u5B89\u88C5\u8FC7\u65E7\u7684 <code>react-native-cli</code> \u547D\u4EE4\u884C\u5DE5\u5177\uFF0C\u82E5\u4E0D\u786E\u5B9A\uFF0C\u53EF\u4F7F\u7528\u5982\u4E0B\u547D\u4EE4\u5206\u522B\u67E5\u770B <code>npm</code> \u548C <code>yarn</code> \u5168\u5C40\u5B89\u88C5\u7684\u5305</p><div class="language-shell line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;">npm list -g</span></span>
<span class="line"><span style="color:#A6ACCD;">yarn global list</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>\u5982\u679C\u5B58\u5728\u8BF7\u4F7F\u7528\u5982\u4E0B\u547D\u4EE4\u5378\u8F7D\u6389\u4EE5\u907F\u514D\u4E00\u4E9B\u51B2\u7A81\uFF1A</p><div class="language-shell line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;">npm uninstall -g react-native-cli @react-native-community/cli</span></span>
<span class="line"><span style="color:#A6ACCD;">yarn global remove react-native-cli @react-native-community/cli</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div></div><p>\u4F7F\u7528 <code>React Native</code> \u5185\u5EFA\u7684\u547D\u4EE4\u884C\u5DE5\u5177\u6765\u521B\u5EFA\u4E00\u4E2A\u540D\u4E3A <code>RN1</code> \u7684\u65B0\u9879\u76EE\u3002\u8FD9\u4E2A\u547D\u4EE4\u884C\u5DE5\u5177\u4E0D\u9700\u8981\u5B89\u88C5\uFF0C\u53EF\u4EE5\u76F4\u63A5\u7528 <code>node</code> \u81EA\u5E26\u7684 <code>npx</code> \u547D\u4EE4\u6765\u4F7F\u7528\uFF08\u6CE8\u610F <code>init</code> \u547D\u4EE4\u9ED8\u8BA4\u4F1A\u521B\u5EFA\u6700\u65B0\u7684\u7248\u672C\uFF09\uFF1A</p><div class="language-shell line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;">npx react-native init RN1</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br></div></div><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>\u521D\u59CB\u5316\u9879\u76EE\u65F6\uFF0C\u9879\u76EE\u540D\u79F0\u4E0D\u80FD\u5305\u542B\u4E2D\u6587\u3001\u7A7A\u683C\u548C\u7279\u6B8A\u7B26\u53F7\uFF0C\u4E5F\u4E0D\u80FD\u4F7F\u7528\u5E38\u89C1\u5173\u952E\u5B57\u4F5C\u4E3A\u9879\u76EE\u540D\uFF0C\u5982 <code>class\u3001native\u3001new</code> \u7B49\u3002</p></div><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>0.60 \u53CA\u4EE5\u4E0A\u7248\u672C\u7684\u539F\u751F\u4F9D\u8D56\u662F\u901A\u8FC7 CocoaPods \u96C6\u6210\u5B89\u88C5\u7684\u3002CocoaPods \u7684\u6E90\u5FC5\u987B\u4F7F\u7528\u4EE3\u7406\u8BBF\u95EE\uFF08\u955C\u50CF\u6E90\u4E5F\u65E0\u6548\uFF09\u3002\u5982\u679C\u5728 CocoaPods \u7684\u4F9D\u8D56\u5B89\u88C5\u6B65\u9AA4\u5361\u4F4F\uFF08\u547D\u4EE4\u884C\u505C\u5728 Installing CocoaPods dependencies \u5F88\u4E45\uFF0C\u6216\u5404\u79CD\u7F51\u7EDC\u8D85\u65F6\u91CD\u7F6E\u62A5\u9519\uFF0C\u6216\u5728 ios \u76EE\u5F55\u4E2D\u65E0\u6CD5\u751F\u6210.xcworkspace \u6587\u4EF6\uFF09\uFF0C\u8BF7\u52A1\u5FC5\u68C0\u67E5\u786E\u5B9A\u4F60\u7684\u4EE3\u7406\u914D\u7F6E\u662F\u5426\u5BF9\u547D\u4EE4\u884C\u6709\u6548\u3002</p></div><h3 id="\u53EF\u9009\u53C2\u6570" tabindex="-1">\u53EF\u9009\u53C2\u6570 <a class="header-anchor" href="#\u53EF\u9009\u53C2\u6570" aria-hidden="true">#</a></h3><h4 id="version-\u6307\u5B9A\u7248\u672C" tabindex="-1"><code>--version</code> \u6307\u5B9A\u7248\u672C <a class="header-anchor" href="#version-\u6307\u5B9A\u7248\u672C" aria-hidden="true">#</a></h4><div class="language-shell line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki"><code><span class="line"><span style="color:#676E95;">#\u6CE8\u610F\u7248\u672C\u53F7\u5FC5\u987B\u7CBE\u786E\u5230\u4E24\u4E2A\u5C0F\u6570\u70B9</span></span>
<span class="line"><span style="color:#A6ACCD;">npx react-native init RN1 --version X.XX.X</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h4 id="template-\u9879\u76EE\u6A21\u7248" tabindex="-1"><code>--template</code> \u9879\u76EE\u6A21\u7248 <a class="header-anchor" href="#template-\u9879\u76EE\u6A21\u7248" aria-hidden="true">#</a></h4><div class="language-shell line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki"><code><span class="line"><span style="color:#676E95;"># \u5E26\u6709TypeScript\u914D\u7F6E\u7684</span></span>
<span class="line"><span style="color:#A6ACCD;">npx react-native init AwesomeTSProject --template react-native-template-typescript</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div>`,51),c=[p];function r(i,d,t,b,A,u){return n(),a("div",null,c)}const y=s(o,[["render",r]]);export{h as __pageData,y as default};
