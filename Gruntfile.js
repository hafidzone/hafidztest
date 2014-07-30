module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-coffee');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    coffee: {
      glob_to_multiple: {
        expand: true,
        flatten: true,
        cwd: 'public/coffee/',
        src: ['*.coffee', '**/*.coffee'],
        dest: 'public/javascripts/app/',
        ext: '.js'
      }
    },
    concat: {
      options: {
        separator: ';',
      },
      css: {
        src: [
          'bower_components/animate.css/animate.css',
          'bower_components/videojs/dist/video.css',
          'public/stylesheets/main.css'
        ],
        dest: 'public/stylesheets/app.css'
      },
      js: {
        src: [
          'bower_components/jquery/jquery.js',
          'bower_components/moment/moment.js',
          'bower_components/handlebars/handlebars.js',
          'bower_components/videojs/dist/video.js',
          'bower_components/cryptojslib/rollups/sha256.js',
          'bower_components/underscore/underscore.js',
          'bower_components/cryptojslib/components/enc-base64-min.js',
          'bower_components/ember/ember.min.js',
          'bower_components/ember-simple-auth/ember-simple-auth.js',
          'public/javascripts/app/main.js',
          'public/javascripts/app/*.js'
        ],
        dest: 'public/javascripts/build.js',
      },
    },
    uglify: {
      dist: {
        files: {
          'public/javascripts/build.min.js': ['public/javascripts/build.js']
        }
      }
    },
    watch: {
      scripts: {
        cwd: 'public/coffee/',
        files: ['*.coffee', '**/*.coffee'],
        tasks: ['coffee', 'concat'],
        options: {
          spawn: false,
        },
      },
    }
  });
  grunt.registerTask('deploy', ['coffee', 'concat', 'uglify']);
};