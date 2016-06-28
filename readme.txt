#Frontend Framework
#--not too fancy, but just right --

This is a straight forward frontend framework. Utilizing require.js, it's made to organize JS/SASS/Jade into 'Views' and 'Layouts'. 

Instructions to do in the command line to get things started:
1. npm install
2. bower instal
3. cd generator-frontend
4. npm link
5. cd ../
6. yo frontend
  6.a make a layout
  6.b make a view
7. gulp
8. Go to: http://localhost:3001/home-page/home-page.html -- for an example of this system.

To add external libs (like stuff installed from bower or npm), add them to the scripts.json file!
This is found at src/libs/scripts.json

I've already included jquery, and require.js. These are required by the framework, so please don't remove them accidentally when adding new external scripts.

Everything else should be taken care of. Let me know if we should clarify anything for future projects!