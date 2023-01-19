import{_ as e,c as i,o as r,d as t}from"./app.a19d119d.js";const a="/blog/brower-computer-network/computer-network/design-patterns/shejimoshi.webp",k=JSON.parse('{"title":"设计模式","description":"","frontmatter":{},"headers":[{"level":2,"title":"设计模式的“道”与“术”","slug":"设计模式的-道-与-术","link":"#设计模式的-道-与-术","children":[{"level":3,"title":"设计模式之道","slug":"设计模式之道","link":"#设计模式之道","children":[]},{"level":3,"title":"SOLID设计原则","slug":"solid设计原则","link":"#solid设计原则","children":[]},{"level":3,"title":"设计模式的核心思想——封装变化","slug":"设计模式的核心思想——封装变化","link":"#设计模式的核心思想——封装变化","children":[]}]},{"level":2,"title":"设计模式的术","slug":"设计模式的术","link":"#设计模式的术","children":[]}],"relativePath":"brower-computer-network/computer-network/design-patterns.md","lastUpdated":1669462906000}'),n={name:"brower-computer-network/computer-network/design-patterns.md"},l=t('<h1 id="设计模式" tabindex="-1">设计模式 <a class="header-anchor" href="#设计模式" aria-hidden="true">#</a></h1><h2 id="设计模式的-道-与-术" tabindex="-1">设计模式的“道”与“术” <a class="header-anchor" href="#设计模式的-道-与-术" aria-hidden="true">#</a></h2><h3 id="设计模式之道" tabindex="-1">设计模式之道 <a class="header-anchor" href="#设计模式之道" aria-hidden="true">#</a></h3><blockquote><p>每一个模式描述了一个在我们周围不断重复发生的问题，以及该问题的解决方案的核心。这样，你就能一次又一次地使用该方案而不必做重复劳动。 —— Christopher Alexander</p></blockquote><h3 id="solid设计原则" tabindex="-1">SOLID设计原则 <a class="header-anchor" href="#solid设计原则" aria-hidden="true">#</a></h3><blockquote><p>&quot;SOLID&quot; 是由罗伯特·C·马丁在 21 世纪早期引入的记忆术首字母缩略字，指代了面向对象编程和面向对象设计的五个基本原则。</p></blockquote><ul><li>单一功能原则（Single Responsibility Principle）</li><li>开放封闭原则（Opened Closed Principle）</li><li>里式替换原则（Liskov Substitution Principle）</li><li>接口隔离原则（Interface Segregation Principle）</li><li>依赖反转原则（Dependency Inversion Principle）</li></ul><p>在 JavaScript 设计模式中，主要用到的设计模式基本都围绕“单一功能”和“开放封闭”这两个原则来展开</p><h3 id="设计模式的核心思想——封装变化" tabindex="-1">设计模式的核心思想——封装变化 <a class="header-anchor" href="#设计模式的核心思想——封装变化" aria-hidden="true">#</a></h3><p>设计模式出现的背景，是软件设计的复杂度日益飙升。软件设计越来越复杂的“罪魁祸首”，就是变化。</p><p>我们能做的只有将这个变化造成的影响最小化 —— 将变与不变分离，确保变化的部分灵活、不变的部分稳定。</p><p>这个过程，就叫“封装变化”；这样的代码，就是我们所谓的“健壮”的代码，它可以经得起变化的考验。而设计模式出现的意义，就是帮我们写出这样的代码。</p><h2 id="设计模式的术" tabindex="-1">设计模式的术 <a class="header-anchor" href="#设计模式的术" aria-hidden="true">#</a></h2><p>所谓“术”，其实就是指二十年前 GOF 提出的最经典的23种设计模式。二十年前，四位程序员前辈（Erich Gamma, Richard Helm, Ralph Johnson &amp; John Vlissides）通过编写《设计模式：可复用面向对象软件的基础》这本书，阐述了设计模式领域的开创性成果。在这本书中，将23种设计模式按照“创建型”、“行为型”和“结构型”进行划分：</p><p><img src="'+a+'" alt="设计模式"></p><p>前面我们说过，设计模式的核心思想，就是“封装变化”。无论是创建型、结构型还是行为型，这些具体的设计模式都是在用自己的方式去封装不同类型的变化。</p><p>无论是创建型、结构型还是行为型，这些具体的设计模式都是在用自己的方式去封装不同类型的变化</p>',17),o=[l];function s(d,c,h,p,u,_){return r(),i("div",null,o)}const b=e(n,[["render",s]]);export{k as __pageData,b as default};