<?php
/** Legacy root is optional; detection matches the original museum source check. */
function bsp_legacy_available(): bool {
    $root=dirname(__DIR__,2);
    return is_file(__DIR__.'/legacy-root.enabled') || (is_file($root.'/app/models.php') && is_file($root.'/app/render.php'));
}
