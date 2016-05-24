jQuery( function( $ ) {

  ( function() {
    var scroll = 0;
    var fix_area = $( '.js-fix' );
    var offset_top = fix_area.offset().top;

    fix();

    $( window ).scroll( function() {
      scroll = $( window ).scrollTop();
      fix();
    } );

    $( window ).resize( function() {
      update_offset_top();
      scroll = $( window ).scrollTop();
      fix();
    } );

    function update_offset_top() {
      if ( fix_area.hasClass( 'fixed' ) ) {
        offset_top = fix_area.removeClass( 'fixed' ).offset().top;
        fix_area.addClass( 'fixed' );
      } else {
        offset_top = fix_area.offset().top;
      }
    }

    function unfixed() {
      fix_area.removeClass( 'fit-bottom' );
      fix_area.removeClass( 'fixed' );
      fix_area.width( '' );
    }

    function fix() {
      if ( $( '.l-sub' ).css( 'flex-basis' ) == '25%' ) {
        if ( $( window ).height() - $( '.l-footer' ).outerHeight() < fix_area.height() ) {
          if ( $( document ).height() - $( window ).height() - $( '.l-footer' ).outerHeight() <= scroll ) {
            unfixed();
            fix_area.addClass( 'fit-bottom' );
            return;
          }
        }

        fix_area.removeClass( 'fit-bottom' );
        if ( scroll >= offset_top ) {
          fix_area.addClass( 'fixed' );
          fix_area.width( fix_area.parent().width() );
        } else {
          update_offset_top();
          unfixed();
        }
      } else {
        unfixed();
        return;
      }
    }
  } )();

} );
