<div <?php post_class(); ?>>
	<?php do_action( 'ct_cele_post_before' ); ?>
	<article>
		<div class='post-header'>
			<h1 class='post-title'><?php the_title(); ?></h1>
			<?php get_template_part( 'content/post-byline' ); ?>
		</div>
		<?php ct_cele_featured_image(); ?>
		<div class="post-content">
			<?php ct_cele_output_last_updated_date(); ?>
			<?php the_content(); ?>
			<?php wp_link_pages( array(
				'before' => '<p class="singular-pagination">' . esc_html__( 'Pages:', 'cele' ),
				'after'  => '</p>',
			) ); ?>
			<?php do_action( 'ct_cele_post_after' ); ?>
		</div>
		<div class="post-meta">
			<?php get_template_part( 'content/post-categories' ); ?>
			<?php get_template_part( 'content/post-tags' ); ?>
			<?php get_template_part( 'content/post-nav' ); ?>
		</div>
	</article>
	<?php comments_template(); ?>
</div>