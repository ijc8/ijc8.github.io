Jekyll::Hooks.register :site, :post_write do |site|
  # Inject GoatCounter into pages which are static files (e.g. pre-built web apps)
  goatcounter = site.config['goatcounter']
  goatcounter_tag = <<~HTML
    <script data-goatcounter="https://#{goatcounter}.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
  HTML
  
  html_files = site.static_files.filter { |f| f.extname == ".html" }  
  html_files.each do |file|
    path = file.destination(site.dest)
    content = File.read(path)
    
    # Skip if this page already has GoatCounter.
    next if content.include?('goatcounter.com') || content.include?('gc.zgo.at')
    
    # Hacky injection; not foolproof.
    if content.include?('</body>')
      content = content.sub('</body>', "#{goatcounter_tag}\n</body>")
    else
      next
    end
    
    File.write(path, content)
    puts "GoatCounter injected into: #{path}"
  end
end
