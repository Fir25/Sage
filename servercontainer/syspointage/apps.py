from django.apps import AppConfig
import threading
from django.utils.module_loading import import_string

class SyspointageConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'syspointage'

    def ready(self):
        """ Démarre le scheduler lorsque Django est prêt """
        run_scheduler_continuously = import_string('syspointage.scheduled_tasks.run_scheduler_continuously')
        schedulepointage = import_string('syspointage.scheduled_tasks.schedulepointage')

        scheduler_thread = threading.Thread(target=run_scheduler_continuously, args=(schedulepointage,), daemon=True)
        scheduler_thread.start()
