import os, sys
os.environ.setdefault('QT_QPA_PLATFORM','xcb')
from PyQt5.QtWidgets import QApplication
from main_minimal import LunaBugApp

OUT=os.path.abspath(os.environ.get('MARKETING_OUT','marketing'))
os.makedirs(OUT,exist_ok=True)
app=QApplication(sys.argv[:1])
w=LunaBugApp(); w.resize(1280,820); w.show(); app.processEvents()

def shot(n):
    app.processEvents(); w.grab().save(os.path.join(OUT,f'frame{n:02d}.png'))

shot(1)
w.topic_edit.setText('AI chip market 2026')
w.size_combo.setCurrentText('2,000')
w.output_combo.setCurrentText('CSV')
shot(2)
w.progress_status.setText('Discovery • 420 candidates')
w.progress_bar.setValue(32); w.moon.set_progress(32)
w.time_label.setText('Elapsed: 00:22  •  ETA: 01:08')
w.result_label.setText('Valid records: 286 / 2,000')
shot(3)
w.progress_status.setText('Extracting and quality-gating public sources')
w.progress_bar.setValue(76); w.moon.set_progress(76)
w.time_label.setText('Elapsed: 01:17  •  ETA: 00:24')
w.result_label.setText('Valid records: 1,524 / 2,000')
shot(4)
w.progress_status.setText('TARGET REACHED • 2,000 / 2,000 quality-gated records')
w.progress_bar.setValue(100); w.moon.set_progress(100)
w.time_label.setText('Elapsed: 01:42  •  ETA: 00:00')
w.result_label.setText('Dataset ready • 2,000 source-backed records • CSV')
shot(5)
w.close(); app.quit()
print(OUT)
