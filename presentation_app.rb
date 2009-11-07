require 'rubygems'
require 'pathname'
require 'sinatra'
require 'yaml'
require 'ostruct'

def root_dir
  @root_dir ||= Pathname(__FILE__).dirname
end

# Load vendorered slidedown.
if (path = root_dir.join("vendor", "slidedown", "lib")).directory?
  $:.unshift(path.to_s) unless $:.include?(path.to_s)
end

require 'slidedown'

set :environment, (ENV["RACK_ENV"] || :production).to_sym
set :root,        root_dir.to_s
set :app_file,    __FILE__

# Not using helpers since we want them in the global scope for the
# template relies on them.

helpers do
  
  CSS_TAG_TEMPLATE = '<link rel="stylesheet" type="text/css" media="screen" href="%s" charset="utf-8" />'.freeze
  JS_TAG_TEMPLATE  = '<script type="text/javascript" charset="utf-8" src="%s"></script>'.freeze
  
  def h(t)
    Rack::Utils.escape_html(t)
  end

  def presentation
    @presentation ||= OpenStruct.new(YAML.load_file(root_dir.join("presentation.yml")))
  end
  
  def live_url(path = "/")
    scheme, port = request.scheme, request.port
    url = scheme + "://"
    url << request.host
    if scheme == "https" && port != 443 || scheme == "http" && port != 80
      url << ":#{request.port}"
    end
    File.join(url, path)
  end
  
  def shrink_javascript(raw)
    require 'jsmin' unless defined?(JSMin)
    JSMin.minify(raw)
  rescue LoadError
    raw
  end
  
  def has_js(*js_files)
    js_files.map { |file| JS_TAG_TEMPLATE % live_url(File.join("javascripts", "#{file}.js")) }.join("\n")
  end
  
  def has_css(*css_files)
    css_files.map { |file| CSS_TAG_TEMPLATE % live_url(File.join("stylesheets", "#{file}.css")) }.join("\n")
  end
  
  
end

get '/' do
  # Render the slides
  @slides = SlideDown.new(root_dir.join("slides.md").read).render(root_dir.join("views", "slides").expand_path)
  erb :presentation
end