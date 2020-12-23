<?php do_action( 'ct_cele_main_bottom' ); ?>
</section> <!-- .main -->

<?php do_action( 'ct_cele_after_main' ); ?>

<?php 
// Elementor `footer` location
if ( ! function_exists( 'elementor_theme_do_location' ) || ! elementor_theme_do_location( 'footer' ) ) :
?>
<footer id="site-footer" class="site-footer" role="contentinfo">
    <?php do_action( 'ct_cele_footer_top' ); ?>
    <div class="design-credit">
        <span>
            <?php
            $footer_text = sprintf( __( '<a href="%1$s" rel="nofollow">%2$s Theme</a> by Compete Themes.', 'cele' ), 'https://www.competethemes.com/cele/', wp_get_theme( get_template() ) );
            $footer_text = apply_filters( 'ct_cele_footer_text', $footer_text );
            echo do_shortcode( wp_kses_post( $footer_text ) );
            ?>
        </span>
    </div>
</footer>
<?php endif; ?>
</div>
<?php do_action( 'ct_cele_overflow_bottom' ); ?>
</div><!-- .overflow-container -->

<?php do_action( 'ct_cele_body_bottom' ); ?>

<?php wp_footer(); ?>

</body>
</html>