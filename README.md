# slidedown-template #

A Simple Wrapper around SlideDown and other stuff, refactored to
make rapid prototyping of a slideshow easier.

Edit...

- Slide specific view in views/slides.erb
- The presentation layout in views/presentation.erb
- Your css for the presentation in stylesheets/presentation.css
- Your slide content in presentation\_app.rb
- presentation.yml for your presentation details. 

It also includes inconsolata for presentation code awesome sauce.

To get started, fork the project for your presentation.
Clone + run `git submodule init && git submodule update`
Next, edit the files above.
Use `ruby presentation_app.rb` to view it (hit /)