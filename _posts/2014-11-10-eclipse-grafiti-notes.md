---
layout: post
title: "Eclipse Grafiti Learning Notes"
modified:
categories: 
excerpt: "Trying to develop a GUI in form of an Eclipse plugin at my HiWi job. At last I chose a more recent tool, \"Graphiti\". This are the notes taken from the tutorials as well as the procedure of development."
tags: [eclipse, graphiti, notes]
comments: true
image:
  feature: lamp.jpg
date: 2014-11-10T01:39:07+01:00
---
<section id="table-of-contents" class="toc">
  <header>
    <h3>Overview</h3>
  </header>
<div id="drawer" markdown="1">
*  Auto generated table of contents
{:toc}
</div>
</section><!-- /#table-of-contents -->

## 1. Introduction
> It is immediately noticeable, that GEF is fairly complex and it needs a notable amount of work to get used to the framework. Therefore, and also to homogenize their tooling, SAP built a framework that hides GEF's complexities from the developer and bridges EMF and GEF to ease and speed up the development of graphical editors. 
    
## 2. Installation
The installation source of the updatest release is included in the official release update channel. Install the "Graphiti SDK Plus" which includes a tutorial in the help document.

## 3. Need to kown

### Architecture:

![Basic Architecture](/images/grafiti-architecture.png)

1. **Interaction Component**: deal with the requests of input (from mouse, keyboard), like click, drag-and-drop, etc. Passing them to Diagram Type Agent. 
2. **Rendering Engine**: to display the current data on the screen. Based on GEF in conjuction with Draw2d.
3. **Diagram Type Agent**: has to be implemented by developer and could make use of a lot of services as well as standard implementations. With these implementations (Actions like _move, resize, delete, remove and print_), one can build a functional editor very quickly. It could also be incrementally implemented in the further development. The major task of Diagram Type Agent is to modify the model data. Servaral models are applied there as follows:

   1. **Domain Model**: contains the model which needs to be graphically displayed. A _.ecore_ model for example could be used here. In Graphiti, the data of Domain model is called **Business Objects**.
   2. **Protogram Model**: ? contains all the information for displaying a diagram. Needs some redundant storage of data. Not quite clear. complish this part late.
   3. **Link Model**: the relation between Domain Model and Protogram Model. Connecting data from Domain Model to the graphical representation from Protogram Model. This is necessory for some actions on the editor, like moving and deleting objects, which changes data of Domain Model as well.

Example: User clicks on a kind of "Create" tool on the tools palette and draws a rectangle in the editor which indicates a rectangle object with the specified size and position should be created. Then the Diagram Type Agent act as following:

   * Create a new object in the Domain Model,
   * Create the graphical visualization in the Pictogram Model. E.g. create Graphics Algorithms like a Rounded Rectangle. Initial them with colors and fonts and the layout.
   * Create link between the Pictogram Model and Domain Model.
        
![Inside Diagram Type Agent](/images/diagram-type-agent-new.png)

**Features** are needed from developers like operations. **Feature Provider** supplies the needed features. Processing the features leads to modifing the datas in the models. **Diagram Type Provider* handels the requests from interactive components. It also decides when to synchronise the Domain and Pictogram Models.
  
The **Diagram Type Agent** is implemented in 4 steps:

   1. Implement a _Diagram Type Provider_
   2. Register it for a new _Diagram Type_.
   3. Create a _Feature Provider_.
   4. Create Feature, for example: _Add Feature_.

    