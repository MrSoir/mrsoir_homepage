
# BallinGL_preview_1

import os
import os.path

dr = '/home/hippo/workspace_bluefish/mrsoir/public/Ballin/pics'
strt = 'Screenshot'
tar_base_name = 'BallinOrig_preview_'
pics = sorted([fn for fn in os.listdir(dr) if fn.startswith(strt)])

for i,p in enumerate(pics):
	tar_name = tar_base_name + str(i) + '.png'
	abs_src = os.path.join(dr, p)
	abs_tar = os.path.join(dr, tar_name)
	os.rename(abs_src, abs_tar)
	print(p, '  -> ', tar_name)
