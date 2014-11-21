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
    
---

## 2. Installation
The installation source of the updatest release is included in the official release update channel. Install the "Graphiti SDK Plus" which includes a tutorial in the help document.

---

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

---

## Hands-on: A simple example

Get familier with the Graphiti plugin development procedure with help of the official tutorial, step by step.


>### Plug-In structure:
>* **org.eclipse.graphiti**
  _The UI platform independent part of the framework_
* **org.eclipse.graphiti.ui**
  _The UI platform dependent part of the framework_
* **org.eclipse.graphiti.mm**
  _The Graphiti EMF model_
* **org.eclipse.graphiti.pattern**
  _Additional Graphiti framework for an alternative approach to combine all implementation aspects in one pattern instead of spreading accross several features._
* **org.eclipse.graphiti.export.batik**
  _The framework export functionality, e.g. save as SVG (using Batik functionality)_
* **org.eclipse.graphiti.doc**
  _The Eclipse help content, e.g. the Graphiti tutorial_
* **org.eclipse.graphiti.examples.common**
  _General parts of samples and test tools for Graphiti; helper UIs, e.g. repository explorer and wizard (contains exemplary coding that cannot be re-used from within tools build on top of Graphiti)_
* **org.eclipse.graphiti.examples.tutorial**
  _The final implementation of the Graphiti tutorial_
* **org.eclipse.graphiti.ui.capabilities**
  _A small example showing how the Eclipse capabilities mechanism can be used with Graphiti_
* **org.eclipse.graphiti.feature**
  _The feature containing purely the Graphiti framework without any additional functionality like SVG export. This feature needs to be included into Eclipse installations containing tools build on top of Graphiti_

### 1. Create Plug-in

Create a blank plug-in project using new project wizard. Add following dependencies :

* _org.eclipse.graphiti_
* _org.eclipse.graphiti.ui_
* _org.eclipse.graphiti.examples.common_
* _org.eclipse.core.resources_
* _org.eclipse.core.runtime_
* _org.eclipse.ui.views.properties.tabbed_

### 2. Diagram Type Agent

A **diagram type agent** should be implemented for creation of an editor of a viewer. As mentioned before, it consists of a **diagram type provider** and a **feature provider**

#### Create a Diagram Type Provider

Add a new package according to the project, create a new class extend the base class _AbstractDiagramTypeProvider_ in oder to implement the interface _iDiagramTypeProvider_.

{% highlight java %}
package rwth.ice.graphiti.helloworld.diagram;

import org.eclipse.graphiti.dt.AbstractDiagramTypeProvider;

public class HelloDiagramTypeProvider extends AbstractDiagramTypeProvider {
  public HelloDiagramTypeProvider() {
    super();
  }
  
}
{% endhighlight %}
Add a new extension using the extension tab within MANIFEST.MF editor with the extension point **_org.eclipse.graphiti.ui.diagramTypeProviders_**. Set the corresponding ID, name, and set the class to the just created one.

#### Create a new Diagram Type of the Provider

Add a new Diagram Type with extension point **_org.eclipse.graphiti.ui.diagramTypes_**, set its ID, name and save it. Right click on the **_Diagram Type Provider_** extension in the list and add a Diagram Type, choose the Diagram type just created.

After these steps, the plugin.xml file should looks like this:
{% highlight xml %}
<?xml version="1.0" encoding="UTF-8"?>
<?eclipse version="3.4"?>
<plugin>
   <extension
         point="org.eclipse.graphiti.ui.diagramTypes">
      <diagramType
            id="de.rwth-aachen.ice.graphiti.helloworld.hellodiagramtype"
            name="hello diagramtype"
            type="Helloworld">
      </diagramType>
   </extension>
   <extension
         point="org.eclipse.graphiti.ui.diagramTypeProviders">
      <diagramTypeProvider
            class="rwth.ice.graphiti.helloworld.diagram.HelloDiagramTypeProvider"
            context="org.eclipse.graphiti.ui.diagramEditor"
            id="de.rwth-aachen.ice.graphiti.helloworld.HelloDiagramTypeProvider"
            name="My first Diagram Type Provider">
         <diagramType
               id="de.rwth-aachen.ice.graphiti.helloworld.hellodiagramtype">
         </diagramType>
      </diagramTypeProvider>
   </extension>

</plugin>
{% endhighlight %}

#### Create a Feature Provider

Create a now class extends **_DefaultFeatureProvider_** in oder to implement the _IFeatureProvider_ interface. Initially, we don't need to overwrite any methods.

{% highlight java %}
package rwth.ice.graphiti.helloworld.diagram;

import org.eclipse.graphiti.dt.IDiagramTypeProvider;
import org.eclipse.graphiti.ui.features.DefaultFeatureProvider;

public class HelloFeatureProvider extends DefaultFeatureProvider {
  public HelloFeatureProvider(IDiagramTypeProvider dtp){
    super(dtp);
  }
}
{% endhighlight %}

We need to create and set it in the construction of Diagram Type Provider as well. Add one line in the construction of DiagramTypeProvider:
{% highlight java %}
public HelloDiagramTypeProvider() {
    super();
    setFeatureProvider(new HelloFeatureProvider(this));
  }
{% endhighlight %}
