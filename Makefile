test: FORCE
	npm test

vagrant-test: FORCE
	vagrant up
	vagrant ssh -c 'cd /vagrant && npm test'

FORCE:
