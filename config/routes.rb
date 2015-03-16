Rails.application.routes.draw do
  
 

  

  get 'registrations/update'

  namespace :admin do
    resources :licences
  end

  get 'main/saveSurvey'

  devise_for :users, class_name: "Admin::User", :controllers => { registrations: 'registrations'}
  get 'admin', :controller => 'admin', :action => 'dashboard'
  
  namespace :admin do

    get 'dashboard', as: 'dashboard'
    # get 'admin/dashboard'
    
    resources :countries
    resources :surveys
  end

  resources :client_surveys

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'admin#dashboard'
    # post 'feedback/:survey_id' => 'main#client_surveys'
    # get 'feedback/:survey_id' => 'main#client_surveys', as: 'main_client_survey'
    get 'feedback/:survey_url' => 'client_surveys#new'

    root 'main#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
