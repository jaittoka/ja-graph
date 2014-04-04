module.exports = (grunt) ->
  grunt.initConfig
    coffee:
      lib:
        expand: true
        cwd: 'src'
        src: [ '**/*.coffee']
        dest: 'lib'
        ext: '.js'

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  
  grunt.registerTask 'default', [ 'coffee:lib' ]
