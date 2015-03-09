# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

# Users
Admin::User.delete_all
Admin::User.create(id: 1, email: 'myowin76@gmail.com', 
  password: 'mandalay7', password_confirmation: 'mandalay7',
	created_at: Time.now)

Admin::Survey.delete_all
Admin::Survey.create(id: 1, name: 'Microsoft Website Survey 2015, in Tokyo', 
  question: 'What do you think of the Microsoft?', user_id: 1,
  url_token: 'ms-12345678',
	created_at: Time.now)
Admin::Survey.create(id: 2, name: 'Xbox Survey CES 2019', 
  question: 'What do you think of the xbox?', user_id: 1,
  url_token: 'ms-89101112'
	created_at: Time.now)