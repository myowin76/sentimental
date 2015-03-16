class Admin::Licence < ActiveRecord::Base
	has_one :user
end
