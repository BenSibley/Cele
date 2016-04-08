<?php if ( is_active_sidebar( 'primary' ) ) : ?>
    <div id="sidebar-primary-container" class="sidebar-primary-container">
        <aside class="sidebar sidebar-primary" id="sidebar-primary" role="complementary">
            <h1 class="screen-reader-text">Sidebar</h1>
            <?php dynamic_sidebar( 'primary' ); ?>
        </aside>
    </div>
<?php endif;