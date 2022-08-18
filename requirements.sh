cd frontend
yarn install
cd ../backend
mkdir media
pip install pip-requirements.txt
python3 manage.py migrate
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', 'admin@admin.com', 'admin')" | python3 manage.py shell