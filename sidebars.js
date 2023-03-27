/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  mySidebar: [{type: 'autogenerated', dirName: '.'}],

  // But you can create a sidebar manually
  // docs: [
  //   'welcome',
  //   {
  //     type: 'category',
  //     label: 'Getting Started with Epicodus',
  //     items: [
  //       'getting_started_with_epicodus/learn_how_to_program',
  //       'getting_started_with_epicodus/growth_mindset',
  //     ]
  //   },
  //   {
  //     type: 'category',
  //     label: 'Getting Started with Intro to Programming',
  //     items: [
  //       'getting_started_with_intro_to_programming/welcome_to_intro',
  //       'getting_started_with_intro_to_programming/text_editor_vscode',
  //     ]
  //   },
  // ]
};

module.exports = sidebars;
