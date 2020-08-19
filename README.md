# gitbucket-embedding-plugin

A GitBucket plugin to replace code link to embed snippet.

**To achieve embed snippet, this plugin is not best way. It should be done by GitBucket itself. Until the day GitBucket get this feature, this plugin could be a one of choices.**

## Screenshot

![screenshot](https://github.com/onukura/gitbucket-embedding-plugin/blob/assets/screenshot.png?raw=true)

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

## Supported link type

```
Links Style:
http(s)://{host_with_or_without_prefix}/{owner}/{repository}/blob/{SHA}/{path/to/file}#L{StartLineNumber}-L{EndLineNumber}

Example1: 
http://localhost:8080/root/gitbucket/blob/19f0431a3fb4a9c3560dbf9b1d74f2073da7708f/GitBucketCoreModuleSpec.scala#L5-L10

Example2: 
http://localhost/root/gitbucket/blob/19f0431a3fb4a9c3560dbf9b1d74f2073da7708f/src/main/scala/GitBucketCoreModuleSpec.scala#L5-L10
```

## Note

Please use link with sha, not branch name such as `master`. Because `master` changes by commits.

```
Good url:
http://localhost:8080/root/gitbucket/blob/19f0431a3fb4a9c3560dbf9b1d74f2073da7708f/GitBucketCoreModuleSpec.scala#L5-L10

No Good url:
http://localhost:8080/root/gitbucket/blob/master/GitBucketCoreModuleSpec.scala#L5-L10
```

## Limitation

user name, repo name, branch name includes special character may not be processed.

## Version

Plugin version|GitBucket version
:---|:---
0.1.x |4.34.x -
