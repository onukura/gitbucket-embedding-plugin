# gitbucket-embedding-plugin

A GitBucket plugin to replace code link to snippet

This is still alpha ver.

## Screenshot

![screenshot](https://github.com/onukura/gitbcket-embedding-plugin/blob/assets/screenshot.png?raw=true)

## Install

1. Download *.jar from Releases.
2. Deploy it to `GITBUCKET_HOME/plugins`.
3. Restart GitBucket.

## Build from source

```sbt
sbt clean package
```

The built package is located at
`target/scala-2.13/gitbucket-embedding-plugin_2.13-{plugin-version}.jar`.

```sbt
sbt assembly
```

This makes the assembly package
`target/scala-2.13/gitbucket-embedding-plugin-{plugin-version}.jar`
for deployment.

## Limitation

Because of path processing, currently this plugin can handle GitBucket which in running without url prefix.
And branch name icludes `/` may occur error.

## Version

Plugin version|GitBucket version
:---|:---
0.1.x |4.34.x -
