import gitbucket.core.plugin.PluginRegistry
import gitbucket.core.service.SystemSettingsService
import io.github.gitbucket.solidbase.model.Version
import javax.servlet.ServletContext

class Plugin extends gitbucket.core.plugin.Plugin {
  override val pluginId: String = "embedding"
  override val pluginName: String = "Embedded Snippet Plugin"
  override val description: String = "Convert link of code to embed snippet"
  override val versions: List[Version] = List(
    new Version("0.1.0"),
    new Version("0.1.1"),
    new Version("0.1.2"),
    new Version("1.0.0"),
    new Version("1.0.1"),
    new Version("1.1.0"),
    new Version("1.2.0"),
  )

  override val assetsMappings: Seq[(String, String)] = Seq("/embedding" -> "/embedding/assets")

  override def javaScripts(registry: PluginRegistry, context: ServletContext, settings: SystemSettingsService.SystemSettings): Seq[(String, String)] = {
    val jsPath = settings.baseUrl.getOrElse(context.getContextPath) + "/plugin-assets/embedding/entry.js"
    Seq(".*" ->
      s"""</script>
        |<script src="$jsPath">""".stripMargin)
  }

}
