---
title: 'vim之书'
date: '2021/7/24'
tags:
- vim
mainImg: 'https://images.unsplash.com/photo-1499673610122-01c7122c5dcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjcxMzg1NzY&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1499673610122-01c7122c5dcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjcxMzg1NzY&ixlib=rb-1.2.1&q=80&w=400'
intro: '我买了一本书叫《精通vim》，所以打算捡起落下的 vim，替换掉现在手里的 vscode。'
---

我小时候有一个`hacker`梦，不知从何而来，也不知在何时消失。毕业一年后下定决心做一个 web 开发者，虽然这条道路并不是那么顺利，但是至少现今可以做我喜欢的工作。

很早以前接触了`linux`，接触了`vim`编辑器，后来工作用`vscode`比较多，上周买了一本`死月`译的《精通 vim》来学习，断断续续看了一遍，因此总结和分享此文。

本文主要内容如下：

- vim 简介
- 插件系统和配置
- 刚需和方案
  - 文件匹配
  - 侧边栏目录
  - 代码补全
  - 构建错误报告
  - 代码风格
  - 编辑器终端
  - 会话机制
- vimscript 基础

## VIM 简介

### 前言

`vim`是最优秀最存粹的编辑器之一，其拥有极佳的跨平台特性，几乎能在所有的计算机上运行，许多`unix`操作系统都预装了`vim或vi`，使用者可以无缝使用`vim`进行编辑工作。

`vim`和其他编辑器最大的区别在于操作方式和设计哲学，想熟练地使用`vim`需要花费很多时间去熟悉`vim`的诸多特性，例如：`模式`、`vimscript`编程语言、`扩展性`、`命令式操作`等等。

相比于`vscode`来说，使用者需要花费很多时间才能配置好同等功能的插件，而在其他编辑器或者`IDE`上都能够轻松实现。

> 如果你无心折腾，那么`vim`不是一个好的选择。

熟练掌握`vim`能够让你更专注于代码本身，并且能够非常自由地编码，如果你想要一个自己能够完全掌握的`vim`，你得花费足够的时间和精力来学习`vim`的操作和优化方式，了解如何控制，如何驯服`vim`。

`vim`在不同的操作系统下，也有不同的选择，我们可以选用`GUI`或者`Terminal`版本的`vim`编辑器，也可以使用各种不同的分支，例如`neovim`或`macvim`。

通常，系统自带的`vim`支持的特性不够全面，我们可以使用`vim --version`查看特性支持列表，这在我们后续安装一些插件的时候很有用。

如果某些插件需要一些语言支持，而目前的`vim`暂不支持其特性，则需要我们卸载并且重新安装`vim`，如若需要更多自定义的功能支持，甚至需要编译安装。

> 推荐安装最新版本的`vim`编辑器。

对于学习使用`vim`的新人来说，强烈推荐在 shell 里运行`vimtutor`这个程序，一步步学习如何使用`vim`。

### 基础

我们需要了解以下几个概念：

- 缓冲区（buffer）
- 窗口（window）
- 标签（tab）
- 标记（marks）
- 寄存器（register）

#### 缓冲区、窗口、标签

`vim`在终端调用的时候可以接收多个文件，每一个文件都有一个单独的缓冲区，缓冲区的大小取决于文件的大小，并且默认加载第一个缓冲区，显示第一个文件的内容。

当我们保存文件的时候，缓冲区的内容才会写入到磁盘中去。

实际上，缓冲区也分为很多种，例如：

- 只读缓冲区
- 活动缓冲区
- 隐藏缓冲区
- 等等

> 这部分知识对于初识`vim`的用户来说属于进阶知识，在此先跳过。

可以使用`:ls`列出所有缓冲区，使用`:bn`和`:bp`切换下一个和前一个缓冲区，显示不同的文件。

标签可以类比为浏览器标签页，`vim`提供不同的标签页也有利于我们同时打开不同的项目，这部分笔者建议使用`tmux`来代替。

窗口则是用来显示缓冲区内容的，我们可以在一个标签页下创建多个窗口，使用`ctrl+w`可以轻松切换窗口。

窗口和缓冲区的关系并不是一对一的，多窗口可以对应单一的缓冲区，也可以在不同窗口载入同一个缓冲区。

在打开多个窗口和文件的时候，默认共用一个缓冲区，因此`:wa`命令可以同时保存当前缓冲区内的所有内容。

#### 标记

关于标记，这个功能笔者用得较少，因为笔者的`.vimrc`中设置了自动保存文件退出的时候的位置信息，很少需要标记一个位置用于快速跳转。

但是`mark`标记的功能依然简单而有用，我们可以通过诸如`ma`命令来标记当前光标所在位置，意为`mark a`，这个标记以`a`为名，通过`'a`快速跳转到标记位置，或者通过`d'a`删除标记。

#### 寄存器

当我们通过诸如`dd`此类的操作指令去操作文本的时候，数据将会暂存到寄存器中。

我们可以通过寄存器命令来操作寄存器内容，例如：`"ayy`可 append 当前行的内容到寄存器`a`中去，如此一来我们可以复制多行内容到寄存器：`"A3yy`,使用大写字母定位追加到哪个寄存器，后续就可以同时取出寄存器内容粘贴到指定位置。

> 寄存器也分为多种类型，具名的和未命名的、不同的操作例如删除一行、删除少于一行的文本、系统剪贴板等等都具有不同的类型。

## 插件系统和配置

### 插件系统

基础功能的`vim`是一个存粹的编辑器，对于简单编辑一些文件已然足够，但是如果需要使用其进行项目开发，则相比于诸如`vscode`之类的同类软件来说在开发体验上是远远不如的。

也许使用`vim`的插件系统是`vim`使用者永远绕不过的一个问题，在`vim 8`版本之前我们通常使用一些包管理插件来管理其他插件，`8`版本之后`vim`的`package`特性让我们可以不使用第三方包管理插件，也能轻松安装和管理插件。

在讨论插件之前，我们需要了解以下三个概念：

- 包：是`vim 8`的新特性，我们可以简单地理解为一个包含若干个`插件`的目录。
- 脚本：vimscript 语言和指令编写的`.vim`文件
- 插件：若干个脚本的合集，组成一个实现特定功能的插件

编辑器启动的时候将会加载某些包里的所有插件，并且根据默认配置文件提供特定的功能特性。

如下是笔者学习的第一个`demo.vim`脚本，使用`vim`编辑之后可以立即执行：`source %`激活这个脚本。

```bash
function! SayHello()
	echo 'Hello, world.'
endfunction

command! Hello call SayHello()
nnoremap Q :Hello<CR>
```

这个脚本有一个函数`SayHello`，我们为其绑定了一个指令`Hello`，并且绑定了一个普通模式下的快捷键`Q`，按下即可执行指令`Hello`，并且调用`sayHello`函数。

这是一个极简却"意义重大"的`hello world`功能，我们可以从社区里那些优秀的插件中瞥见其浮光掠影，毕竟这是开发者们喜闻乐见的编程起点 😂。

> vim 默认在启动的时候加载`$HOME/.vimrc`这个默认的配置文件

因此，我们可以将通用配置写入`.vimrc`，也可以将插件的特殊配置写入插件目录中的脚本或者配置文件中。

也许在未来的某一天，我们灵光一闪写出了一个能解决社区开发者某个刚需的脚本，这时候我们可以将其组织成一个插件，并且发布出去让大家自由使用和分享。

一个插件的基础目录如下：

```bash
.
└── demo-plugin
  ├── doc
  │  └── demo.txt
  └── plugin
      └── demo.vim
```

`vim`根据插件目录中的命名自动 `source`上述脚本。在`vim 8`之后，我们可以方便的手动安装插件，也可以使用早已流行的诸多插件管理方案。

打开一个`vim`窗口，输入命令：`:h packages`即可打开一个关于包的管理说明文件。

通过阅读此文件，我们可以知道通常我们可以在`$HOME/.vim/pack`下保存我们的插件，插件文件夹中提供一个`start`目录里面存放`vim`启动的时候需要加载的脚本。

某种意义上来说，只要将一个插件存放在包目录下就可以视为安装了此插件，重启`vim`编辑器即可使用插件的功能，执行`:helptags ALL`命令即可让我们索引到插件中`doc`目录下的文档说明，再使用`:help xxx`命令就可以打开特定的插件文档了，如果某些目录无法打开，则检查一下目录的权限即可。

按使用来分，插件可以分为`常用`和`可选使用`两种，常用插件我们放在包的`start`目录中，可选使用的插件可以放在包的`opt`目录中，`vim`启动的时候不会主动加载这些插件，可以通过命令：`packadd xxx`手动加载插件。

当我们手动管理这些插件的时候如果需要从`github`更新插件，则需要逐个进行`git pull`拉取，这无疑需要花费额外的时间。

为了提高使用效率，我们可以利用特定的包管理工具来管理不同的插件，流行的包管理插件有以下几种:

- vim-plug
- Vundle
- Pathogen
- minpac
- ...

使用流行的插件管理器可以让我们在安装社区优秀的插件的时候可以获得更好的文档支持，这些插件通常会提供一些安装插件和配合插件管理器的安装配置方案描述。

我们可以通过`github`轻松找到这些管理器的地址和安装使用方法，如果遇到一些问题，可以在`readme`文档和`issue`中找到一些指引。

后续在增强我们的使用体验的时候，再引入各种插件支持。

### 配置文件

在用户层面，`$HOME/.vimrc`是`vim`的默认配置文件，如果没有则可以创建，后续可以通过`source %`命令加载此文件，或者重启`vim`让其自动加载配置文件的配置，获得某些个性化支持。

> Talk is cheap.

这里有一个很好用的在线配置小站：[VimConfig - Sane and simple Vim configuration](https://vimconfig.com/)，用户可以在浏览器界面选择编辑器特性，最终得到一个可用的配置文件。

让我们从一个简短的`.vimrc`文件开始:

```bash
syntax on " turn on syntax highlight
" undo file 实现编辑保存后撤销
set undofile
set undodir=~/.vim/undodir/
set nocompatible " 不兼容 vi
set nu " 显示行号
set expandtab " tab 转空格
set breakindent " 换行缩进
" tab 宽度，支持退格删除
set shiftwidth=0 
set tabstop=2
set backspace=2
" 智能缩进
set smartindent
set showcmd " show command in status line
set showmatch " show matching brackets
set ignorecase " do case insensitive matching 忽略大小写匹配
set incsearch " Incremental search
set autowrite " auto save before commands like :next and :make
set hidden " auto save buffer before switch buffers
set mouse=a "enable mouse usage
set ttyfast                " Faster redrawing.
set lazyredraw             " Only redraw when necessary.

" auto trailing space
" Removes trailing spaces
function TrimWhiteSpace()
  %s/\s*$//
  ''
endfunction
" 自动清除行头尾空格
autocmd FileWritePre * call TrimWhiteSpace()
autocmd FileAppendPre * call TrimWhiteSpace()
autocmd FilterWritePre * call TrimWhiteSpace()
autocmd BufWritePre * call TrimWhiteSpace()
" file type
" 启动文件类型插件以支持部分插件功能
filetype on
filetype plugin on
filetype indent on
" 修改 leader 键，设置强制提权保存和高亮当前行的优化
let mapleader = ','
noremap <Leader>W :w !sudo tee % > /dev/null
highlight CursorLine cterm=NONE ctermbg=NONE ctermfg=NONE guibg=NONE guifg=NONE
set cursorline
```

当我们开始使用`vim`的时候，`.vimrc`将会跟着我们的需求变化而变化，如果在使用上有任何特性需求，都可以搜索相关解决方法。



## 刚需

> 我的刚需也许不是你的刚需，推荐使用`vim-Plug`管理插件。

笔者对写代码有以下几个希望能够方便操作的需求：

- 文件匹配和切换
- 侧边栏目录
- 代码补全和注释
- 构建错误报告
- 代码风格
- 编辑器终端
- 会话机制

逐个寻找解决方案。

> 插件的安装和使用不方便逐一详细说明，其中会需要解决一个个不同场景下的问题，使用者依然需要慢慢找折腾。

### 文件匹配和切换

我选择极具盛名的`fzf`命令行模糊查找器，在`github`上可以轻松找到其仓库，安装之后需要配合`vim`插件:`fzf.vim`

[junegunn/fzf.vim: fzf vim](https://github.com/junegunn/fzf.vim)

看看这命令：

![](https://raw.githubusercontent.com/youyiqin/markdown_imgs/master/v2-3671b2af3814a94c9aaa144f53cc02dc_720w.jpg)

使用此插件可以轻松搜索到我们需要的东西，真是神器。

更多详细的安装和使用知识掠去不表，我觉得网友这一篇已经写得很好了[fzf.vim 猛男必备超强 vim 搜索插件[视频]](https://zhuanlan.zhihu.com/p/116915939)，还搭配了视频食用。

### 侧边栏文件目录树

大名鼎鼎的[preservim/nerdtree: A tree explorer plugin for vim.](https://github.com/preservim/nerdtree)我们依然可以通过添加键盘映射的方式获得跟`vscode`类似的操作体验。

例如：

```bash
nnoremap <leader>n :NERDTreeFocus<CR>
nnoremap <C-n> :NERDTree<CR>
nnoremap <C-t> :NERDTreeToggle<CR>
nnoremap <C-f> :NERDTreeFind<CR>
```

这里对`map`简单介绍一下：

`map a b`表示按键映射，按`a`等于按`b`。在`map`前面可以添加默认字符：`v`/`n`/`i`分别代表`visual`可视化模式/`normal`普通模式/`insert`插入模式下的按键映射。

`nore`等同于`no recursive`非递归调用，以免引起按键映射异常。

`<C-n>`表示组合键`ctrl+n`，首字母非常好理解，其他按键组合也可以根据首字母来理解。

`vim`有一个`leader`键，用于和其他按键配合来实现复杂的组合按键效果。

我们可以使用`let mapleader = ','`指定`leader`键为`','`。

> 使用插件很重要的一点就是阅读文档，文档能给我们提供很多信息和解决异常的方法。

### 代码补全和注释

代码补全我选择了国内大佬`jayli`开发的`vim-easycomplete`:

[vim-easycomplete/README-cn.md at master · jayli/vim-easycomplete](https://github.com/jayli/vim-easycomplete/blob/master/README-cn.md)

自称为`余杭区最好用的vim自动补全插件`，不能配合`supertab`使用。这个插件支持`LSP`安装，对于需要补全的语言需要安装特定的`LSP Server`，并且支持输入目录匹配，自此可以实现跟`vscode`地址补全功能的特性。

`vim-easycomplete`依赖于`LSP Server`的引擎支持，可以通过`:EasyCompleteInstallServer ${Plugin_Name}`来安装插件：

| 插件名称  | 补全类型/支持语言     | LSP Server 命令        | 快捷安装 LSP 依赖 | 环境依赖    |
| --------- | --------------------- | ---------------------- | ----------------- | ----------- |
| directory | 文件路径补全          | 不需要                 | 不需要            | 不需要      |
| buf       | 关键词/字典补全       | 不需要                 | 不需要            | 不需要      |
| ts        | JavaScript/TypeScript | tsserver               | Yes               | node/npm    |
| vim       | Vim                   | vim-language-server    | Yes               | node/npm    |
| cpp       | C/C++                 | ccls                   | Yes               | ruby/brew   |
| css       | CSS                   | css-languageserver     | Yes               | node/npm    |
| html      | html                  | html-languageserver    | Yes               | node/npm    |
| sh        | Bash                  | bash-language-server   | Yes               | node/npm    |
| json      | JSON                  | json-languageserver    | Yes               | node/npm    |
| yml       | Yaml                  | yaml-language-server   | Yes               | node/npm    |
| py        | Python                | pyls                   | Yes               | python/pip  |
| java      | Java                  | eclipse-jdt-ls         | Yes               | java/jdk    |
| go        | Go                    | gopls                  | Yes               | go          |
| rb        | Ruby                  | solargraph             | Yes               | ruby/bundle |
| lua       | Lua                   | emmylua-ls             | Yes               | java/jdk    |
| nim       | Nim                   | nimlsp                 | Yes               | nim/nimble  |
| grvy      | groovy                | groovy-language-server | Yes               | java/jdk    |
| snips     | 代码片段补全          | ultisnips/vim-snippets | 不需要            | 不需要      |

这种程度的支持，能够让我们很好的实现符合要求的代码补全功能，当然还需要安装如下两个插件：

```bash
Plug 'SirVer/ultisnips'
Plug 'honza/vim-snippets'
```

视扩展管理插件的格式来替换，上述使用了`vim-plug`的格式。

> 更多相关配置酌情参考官方文档

注释我选择了：[preservim/nerdcommenter: Vim plugin for intensely nerdy commenting powers](https://github.com/preservim/nerdcommenter)

安装后零配置，即可使用`<leader>cc`注释，使用`<leader>c<space>`取消注释，其他方式请查看官方文档。

### 构建错误报告

当代码出现可以优化的部分，或者出现错误的时候，我们希望能够在编辑的时候自动按照某种规则检查代码，并且给出提示，如此一来我们便可以及早对错误和警告进行修复。对此，我们引入一个新的模式：`quickfix`模式。

> `:copen`命令可以打开一个位于底部的`quicklist`信息窗口

`quickfix`思想即保存一个位置列表，开发者通过一系列的命令实现这个位置列表中的跳转。

在前端开发中，很少有类似`C/C++`或`Go`这样的编译场景，即使是`Typescript`的编译，通常也交由`webpack`的工作流去处理，我们需要的是代码`linter`。

当代码出现不符合语法和规范的时候，希望能将告警信息和`quickfix`结合，即需要在编辑器上做出标识，也能让我们拥有`quickfix`信息提示，以及快速跳转到关键行的能力。



## 推荐资料

- [Learn Vimscript the Hard Way](https://learnvimscriptthehardway.stevelosh.com/)
- [wsdjeg/vim-galore-zh_cn: Vim 从入门到精通](https://github.com/wsdjeg/vim-galore-zh_cn)
- [《精通Vim：用Vim 8和Neovim实现开发 住·尼尔 电子工业出版社 9787121383281》](https://item.jd.com/10025575766068.html?cu=true&utm_source=www.google.com&utm_medium=tuiguang&utm_campaign=t_1001542270_1002004306_0_1931988517&utm_term=f32ba044fccd40d193538fe185580d0d)
- [fzf.vim 猛男必备超强 vim 搜索插件[视频] - 知乎](https://zhuanlan.zhihu.com/p/116915939)
- [junegunn/fzf.vim: fzf vim](https://github.com/junegunn/fzf.vim)

