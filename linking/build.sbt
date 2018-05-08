enablePlugins(ScalaJSPlugin)

name := "Rholang linker"
scalaVersion := "2.12.2" // or any other Scala version >= 2.10.2

// This is an application with a main method
scalaJSUseMainModuleInitializer := true

// "io.scalajs" %%% "nodejs" % "0.4.2"
resolvers += Resolver.jcenterRepo

libraryDependencies +=  "io.scalajs" %%% "nodejs" % "0.4.2"

scalaJSModuleKind := ModuleKind.CommonJSModule
